import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CodeEditor from "../components/CodeEditor";

const EditorScreen = ({ route }) => {
    const { projectId } = route.params || {};
    const [code, setCode] = useState(
        '// Start coding in KODEON...\nfunction hello() {\n  print("Hello, KODEON!");\n}'
    );
    const [fileName, setFileName] = useState("main.kodeon");
    const [isRunning, setIsRunning] = useState(false);

    const handleRunCode = () => {
        setIsRunning(true);
        // In a real implementation, this would call the KODEON compiler
        setTimeout(() => {
            setIsRunning(false);
            // Show output/results
        }, 1000);
    };

    const handleSave = () => {
        // Save the code to the project
        console.log("Saving code...");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.fileName}>{fileName}</Text>
                <View style={styles.toolbar}>
                    <TouchableOpacity
                        style={styles.toolbarButton}
                        onPress={handleSave}
                    >
                        <Text style={styles.toolbarButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toolbarButton, styles.runButton]}
                        onPress={handleRunCode}
                        disabled={isRunning}
                    >
                        <Text style={styles.toolbarButtonText}>
                            {isRunning ? "Running..." : "Run"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <CodeEditor code={code} onChange={setCode} />

            <View style={styles.outputPanel}>
                <Text style={styles.outputTitle}>Output</Text>
                <ScrollView style={styles.outputContainer}>
                    <Text style={styles.outputText}>
                        // Output will appear here
                    </Text>
                </ScrollView>
            </View>
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
    fileName: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    toolbar: {
        flexDirection: "row",
    },
    toolbarButton: {
        backgroundColor: "#007acc",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        marginLeft: 10,
    },
    runButton: {
        backgroundColor: "#4caf50",
    },
    toolbarButtonText: {
        color: "#ffffff",
        fontSize: 14,
    },
    outputPanel: {
        height: 150,
        borderTopWidth: 1,
        borderTopColor: "#333333",
        backgroundColor: "#252525",
    },
    outputTitle: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "bold",
        padding: 10,
    },
    outputContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    outputText: {
        color: "#cccccc",
        fontSize: 12,
    },
});

export default EditorScreen;
