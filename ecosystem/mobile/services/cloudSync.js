/**
 * Cloud Synchronization Service for KODEON Mobile IDE
 * Handles synchronization of projects and files with the cloud
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { cloud } from "../config/mobile.config";

class CloudSyncService {
    constructor() {
        this.apiUrl = cloud.apiUrl;
        this.syncInterval = cloud.syncInterval;
        this.syncEnabled = cloud.syncEnabled;
        this.syncTimer = null;
    }

    /**
     * Check if user is authenticated with cloud service
     * @returns {Promise<boolean>} Authentication status
     */
    async isAuthenticated() {
        try {
            const token = await AsyncStorage.getItem("kodeon_cloud_token");
            return !!token;
        } catch (error) {
            console.error("Error checking authentication:", error);
            return false;
        }
    }

    /**
     * Authenticate user with cloud service
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise<Object>} Authentication result
     */
    async authenticate(username, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    `Authentication failed with status ${response.status}`
                );
            }

            const result = await response.json();

            // Store token securely
            await AsyncStorage.setItem("kodeon_cloud_token", result.token);

            return result;
        } catch (error) {
            throw new Error(`Authentication error: ${error.message}`);
        }
    }

    /**
     * Register new user with cloud service
     * @param {string} username - Desired username
     * @param {string} email - User's email
     * @param {string} password - Desired password
     * @returns {Promise<Object>} Registration result
     */
    async register(username, email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    `Registration failed with status ${response.status}`
                );
            }

            const result = await response.json();
            return result;
        } catch (error) {
            throw new Error(`Registration error: ${error.message}`);
        }
    }

    /**
     * Synchronize projects with cloud
     * @returns {Promise<Object>} Sync result
     */
    async syncProjects() {
        try {
            if (!this.syncEnabled) {
                throw new Error("Cloud sync is disabled");
            }

            const token = await AsyncStorage.getItem("kodeon_cloud_token");
            if (!token) {
                throw new Error("User not authenticated");
            }

            // Get local projects
            const localProjectsJson = await AsyncStorage.getItem(
                "kodeon_projects"
            );
            const localProjects = localProjectsJson
                ? JSON.parse(localProjectsJson)
                : [];

            // Get remote projects
            const response = await fetch(`${this.apiUrl}/projects`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch remote projects with status ${response.status}`
                );
            }

            const remoteProjects = await response.json();

            // Sync logic - merge projects based on last modified time
            const syncedProjects = this.mergeProjects(
                localProjects,
                remoteProjects
            );

            // Update local storage
            await AsyncStorage.setItem(
                "kodeon_projects",
                JSON.stringify(syncedProjects)
            );

            // Update remote projects if needed
            await this.updateRemoteProjects(syncedProjects, token);

            return {
                success: true,
                message: "Projects synchronized successfully",
                projects: syncedProjects,
            };
        } catch (error) {
            throw new Error(`Sync error: ${error.message}`);
        }
    }

    /**
     * Merge local and remote projects based on last modified time
     * @param {Array} localProjects - Local projects
     * @param {Array} remoteProjects - Remote projects
     * @returns {Array} Merged projects
     */
    mergeProjects(localProjects, remoteProjects) {
        const projectMap = new Map();

        // Add all remote projects to map
        remoteProjects.forEach((project) => {
            projectMap.set(project.id, project);
        });

        // Add or update with local projects based on last modified time
        localProjects.forEach((project) => {
            const existingProject = projectMap.get(project.id);
            if (
                !existingProject ||
                new Date(project.lastModified) >
                    new Date(existingProject.lastModified)
            ) {
                projectMap.set(project.id, project);
            }
        });

        return Array.from(projectMap.values());
    }

    /**
     * Update remote projects with local changes
     * @param {Array} projects - Projects to update
     * @param {string} token - Authentication token
     */
    async updateRemoteProjects(projects, token) {
        try {
            // In a real implementation, this would send only changed projects
            // For now, we'll just make a placeholder request
            await fetch(`${this.apiUrl}/projects/sync`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ projects }),
            });
        } catch (error) {
            console.error("Error updating remote projects:", error);
        }
    }

    /**
     * Start automatic synchronization
     */
    startAutoSync() {
        if (!this.syncEnabled) return;

        this.stopAutoSync(); // Clear any existing timer

        this.syncTimer = setInterval(async () => {
            try {
                await this.syncProjects();
            } catch (error) {
                console.error("Auto-sync failed:", error);
            }
        }, this.syncInterval);
    }

    /**
     * Stop automatic synchronization
     */
    stopAutoSync() {
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
            this.syncTimer = null;
        }
    }

    /**
     * Upload a project to the cloud
     * @param {Object} project - Project to upload
     * @returns {Promise<Object>} Upload result
     */
    async uploadProject(project) {
        try {
            const token = await AsyncStorage.getItem("kodeon_cloud_token");
            if (!token) {
                throw new Error("User not authenticated");
            }

            const response = await fetch(
                `${this.apiUrl}/projects/${project.id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(project),
                }
            );

            if (!response.ok) {
                throw new Error(`Upload failed with status ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            throw new Error(`Upload error: ${error.message}`);
        }
    }

    /**
     * Download a project from the cloud
     * @param {string} projectId - ID of project to download
     * @returns {Promise<Object>} Downloaded project
     */
    async downloadProject(projectId) {
        try {
            const token = await AsyncStorage.getItem("kodeon_cloud_token");
            if (!token) {
                throw new Error("User not authenticated");
            }

            const response = await fetch(
                `${this.apiUrl}/projects/${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Download failed with status ${response.status}`
                );
            }

            const project = await response.json();
            return project;
        } catch (error) {
            throw new Error(`Download error: ${error.message}`);
        }
    }
}

export default new CloudSyncService();
