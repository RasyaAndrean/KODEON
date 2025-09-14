import { useRef, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

const CodeEditor = ({ code, onChange }) => {
    const [lineCount, setLineCount] = useState(1);
    const textInputRef = useRef(null);

    const handleTextChange = (text) => {
        onChange(text);
        // Calculate line count
        const lines = text.split("\n");
        setLineCount(lines.length);
    };

    // Simple syntax highlighting function (would be more complex in reality)
    const highlightSyntax = (text) => {
        // This is a simplified version - a real implementation would be more sophisticated
        return text;
    };

    return (
        <View style={styles.container}>
            <View style={styles.lineNumbersContainer}>
                {Array.from({ length: lineCount }, (_, i) => (
                    <Text key={i} style={styles.lineNumber}>
                        {i + 1}
                    </Text>
                ))}
            </View>
            <ScrollView style={styles.editorContainer} horizontal={true}>
                <TextInput
                    ref={textInputRef}
                    style={styles.editor}
                    multiline={true}
                    scrollEnabled={false}
                    value={code}
                    onChangeText={handleTextChange}
                    placeholder="Start coding..."
                    placeholderTextColor="#666666"
                    fontFamily="monospace"
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#1e1e1e",
    },
    lineNumbersContainer: {
        width: 40,
        backgroundColor: "#2d2d2d",
        paddingVertical: 10,
        alignItems: "flex-end",
        paddingRight: 5,
    },
    lineNumber: {
        color: "#858585",
        fontSize: 12,
        fontFamily: "monospace",
    },
    editorContainer: {
        flex: 1,
    },
    editor: {
        flex: 1,
        color: "#d4d4d4",
        fontSize: 14,
        padding: 10,
        backgroundColor: "#1e1e1e",
        fontFamily: "monospace",
        lineHeight: 20,
    },
});

export default CodeEditor;
