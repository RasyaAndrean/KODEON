/**
 * File Management Service for KODEON Mobile IDE
 * Handles file operations, project management, and storage
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

class FileManager {
    constructor() {
        this.projectsKey = "kodeon_projects";
        this.currentProjectKey = "kodeon_current_project";
    }

    /**
     * Get all projects from storage
     */
    async getProjects() {
        try {
            const projectsJson = await AsyncStorage.getItem(this.projectsKey);
            return projectsJson ? JSON.parse(projectsJson) : [];
        } catch (error) {
            console.error("Error getting projects:", error);
            return [];
        }
    }

    /**
     * Save projects to storage
     */
    async saveProjects(projects) {
        try {
            await AsyncStorage.setItem(
                this.projectsKey,
                JSON.stringify(projects)
            );
            return true;
        } catch (error) {
            console.error("Error saving projects:", error);
            return false;
        }
    }

    /**
     * Create a new project
     */
    async createProject(name) {
        try {
            const projects = await this.getProjects();
            const newProject = {
                id: Date.now().toString(),
                name,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                files: [
                    {
                        id: "main",
                        name: "main.kodeon",
                        content:
                            '// Your KODEON code goes here\nfunction main() {\n  print("Hello, KODEON!");\n}',
                        path: "main.kodeon",
                    },
                ],
            };

            projects.push(newProject);
            await this.saveProjects(projects);
            return newProject;
        } catch (error) {
            console.error("Error creating project:", error);
            return null;
        }
    }

    /**
     * Get a specific project by ID
     */
    async getProjectById(projectId) {
        try {
            const projects = await this.getProjects();
            return projects.find((project) => project.id === projectId) || null;
        } catch (error) {
            console.error("Error getting project:", error);
            return null;
        }
    }

    /**
     * Update a project
     */
    async updateProject(project) {
        try {
            const projects = await this.getProjects();
            const index = projects.findIndex((p) => p.id === project.id);

            if (index !== -1) {
                projects[index] = {
                    ...project,
                    lastModified: new Date().toISOString(),
                };
                await this.saveProjects(projects);
                return true;
            }

            return false;
        } catch (error) {
            console.error("Error updating project:", error);
            return false;
        }
    }

    /**
     * Delete a project
     */
    async deleteProject(projectId) {
        try {
            const projects = await this.getProjects();
            const filteredProjects = projects.filter(
                (project) => project.id !== projectId
            );
            await this.saveProjects(filteredProjects);
            return true;
        } catch (error) {
            console.error("Error deleting project:", error);
            return false;
        }
    }

    /**
     * Create a new file in a project
     */
    async createFile(projectId, fileName, content = "") {
        try {
            const project = await this.getProjectById(projectId);

            if (project) {
                const newFile = {
                    id: Date.now().toString(),
                    name: fileName,
                    content,
                    path: fileName,
                };

                project.files.push(newFile);
                await this.updateProject(project);
                return newFile;
            }

            return null;
        } catch (error) {
            console.error("Error creating file:", error);
            return null;
        }
    }

    /**
     * Update file content
     */
    async updateFileContent(projectId, fileId, content) {
        try {
            const project = await this.getProjectById(projectId);

            if (project) {
                const fileIndex = project.files.findIndex(
                    (file) => file.id === fileId
                );

                if (fileIndex !== -1) {
                    project.files[fileIndex].content = content;
                    project.files[fileIndex].lastModified =
                        new Date().toISOString();
                    await this.updateProject(project);
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.error("Error updating file content:", error);
            return false;
        }
    }

    /**
     * Delete a file from a project
     */
    async deleteFile(projectId, fileId) {
        try {
            const project = await this.getProjectById(projectId);

            if (project) {
                project.files = project.files.filter(
                    (file) => file.id !== fileId
                );
                await this.updateProject(project);
                return true;
            }

            return false;
        } catch (error) {
            console.error("Error deleting file:", error);
            return false;
        }
    }

    /**
     * Get current project ID
     */
    async getCurrentProjectId() {
        try {
            return await AsyncStorage.getItem(this.currentProjectKey);
        } catch (error) {
            console.error("Error getting current project ID:", error);
            return null;
        }
    }

    /**
     * Set current project ID
     */
    async setCurrentProjectId(projectId) {
        try {
            await AsyncStorage.setItem(this.currentProjectKey, projectId);
            return true;
        } catch (error) {
            console.error("Error setting current project ID:", error);
            return false;
        }
    }
}

export default new FileManager();
