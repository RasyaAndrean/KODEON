import { useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ProjectExplorer = () => {
    // Mock file structure
    const [files, setFiles] = useState([
        { id: "1", name: "main.kodeon", type: "file", icon: "📄" },
        {
            id: "2",
            name: "utils",
            type: "folder",
            icon: "📁",
            expanded: false,
            children: [
                { id: "3", name: "helpers.kodeon", type: "file", icon: "📄" },
                { id: "4", name: "constants.kodeon", type: "file", icon: "📄" },
            ],
        },
        {
            id: "5",
            name: "components",
            type: "folder",
            icon: "📁",
            expanded: false,
            children: [
                { id: "6", name: "Button.kodeon", type: "file", icon: "📄" },
                { id: "7", name: "Input.kodeon", type: "file", icon: "📄" },
            ],
        },
        { id: "8", name: "README.md", type: "file", icon: "📄" },
    ]);

    const toggleFolder = (folderId) => {
        setFiles((prevFiles) =>
            prevFiles.map((file) => {
                if (file.id === folderId && file.type === "folder") {
                    return { ...file, expanded: !file.expanded };
                }
                return file;
            })
        );
    };

    const handleFilePress = (file) => {
        if (file.type === "folder") {
            toggleFolder(file.id);
        } else {
            // Open file in editor
            console.log("Opening file:", file.name);
        }
    };

    const handleNewFile = () => {
        Alert.prompt(
            "New File",
            "Enter file name:",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Create",
                    onPress: (fileName) => {
                        if (fileName) {
                            setFiles((prevFiles) => [
                                ...prevFiles,
                                {
                                    id: Date.now().toString(),
                                    name: fileName,
                                    type: "file",
                                    icon: "📄",
                                },
                            ]);
                        }
                    },
                },
            ],
            "plain-text"
        );
    };

    const handleNewFolder = () => {
        Alert.prompt(
            "New Folder",
            "Enter folder name:",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Create",
                    onPress: (folderName) => {
                        if (folderName) {
                            setFiles((prevFiles) => [
                                ...prevFiles,
                                {
                                    id: Date.now().toString(),
                                    name: folderName,
                                    type: "folder",
                                    icon: "📁",
                                    expanded: false,
                                    children: [],
                                },
                            ]);
                        }
                    },
                },
            ],
            "plain-text"
        );
    };

    const renderFileItem = ({ item, nestingLevel = 0 }) => {
        const paddingLeft = nestingLevel * 20;

        return (
            <View key={item.id}>
                <TouchableOpacity
                    style={[styles.fileItem, { paddingLeft }]}
                    onPress={() => handleFilePress(item)}
                >
                    <Text style={styles.fileIcon}>{item.icon}</Text>
                    <Text style={styles.fileName}>{item.name}</Text>
                </TouchableOpacity>

                {item.type === "folder" && item.expanded && item.children && (
                    <FlatList
                        data={item.children}
                        renderItem={({ item: child }) =>
                            renderFileItem({
                                item: child,
                                nestingLevel: nestingLevel + 1,
                            })
                        }
                        keyExtractor={(child) => child.id}
                    />
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Project Explorer</Text>
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleNewFile}
                    >
                        <Text style={styles.actionButtonText}>📄</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleNewFolder}
                    >
                        <Text style={styles.actionButtonText}>📁</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={files}
                renderItem={renderFileItem}
                keyExtractor={(item) => item.id}
                style={styles.fileList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1e1e1e",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#2d2d2d",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
    },
    actions: {
        flexDirection: "row",
    },
    actionButton: {
        padding: 5,
        marginLeft: 10,
    },
    actionButtonText: {
        fontSize: 18,
    },
    fileList: {
        flex: 1,
    },
    fileItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#333333",
    },
    fileIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    fileName: {
        fontSize: 14,
        color: "#ffffff",
    },
});

export default ProjectExplorer;
