import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const SettingsScreen = () => {
    const navigation = useNavigation();
    const [darkMode, setDarkMode] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [syntaxHighlighting, setSyntaxHighlighting] = useState(true);
    const [cloudSync, setCloudSync] = useState(true);
    const [aiAssistant, setAiAssistant] = useState(true);

    const handleSaveSettings = () => {
        // In a real implementation, this would save settings to storage
        Alert.alert(
            "Settings Saved",
            "Your settings have been saved successfully."
        );
    };

    const handleClearCache = () => {
        Alert.alert(
            "Clear Cache",
            "Are you sure you want to clear the cache? This will remove all locally stored data.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive" },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Editor Preferences</Text>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Dark Mode</Text>
                    <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
                    />
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Auto Save</Text>
                    <Switch
                        value={autoSave}
                        onValueChange={setAutoSave}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={autoSave ? "#f5dd4b" : "#f4f3f4"}
                    />
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Syntax Highlighting</Text>
                    <Switch
                        value={syntaxHighlighting}
                        onValueChange={setSyntaxHighlighting}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={syntaxHighlighting ? "#f5dd4b" : "#f4f3f4"}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cloud & Sync</Text>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Cloud Sync</Text>
                    <Switch
                        value={cloudSync}
                        onValueChange={setCloudSync}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={cloudSync ? "#f5dd4b" : "#f4f3f4"}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Assistant</Text>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Enable AI Assistant</Text>
                    <Switch
                        value={aiAssistant}
                        onValueChange={setAiAssistant}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={aiAssistant ? "#f5dd4b" : "#f4f3f4"}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Storage</Text>

                <TouchableOpacity
                    style={styles.settingButton}
                    onPress={handleClearCache}
                >
                    <Text style={styles.settingButtonText}>Clear Cache</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveSettings}
            >
                <Text style={styles.saveButtonText}>Save Settings</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1e1e1e",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 15,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#333333",
    },
    settingText: {
        fontSize: 16,
        color: "#ffffff",
    },
    settingButton: {
        paddingVertical: 15,
    },
    settingButtonText: {
        fontSize: 16,
        color: "#007acc",
    },
    saveButton: {
        backgroundColor: "#007acc",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 30,
    },
    saveButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default SettingsScreen;
