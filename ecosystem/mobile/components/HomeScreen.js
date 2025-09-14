import { useNavigation } from "@react-navigation/native";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const HomeScreen = () => {
    const navigation = useNavigation();

    // Mock data for recent projects
    const recentProjects = [
        { id: "1", name: "My First Project", lastModified: "2025-09-10" },
        { id: "2", name: "Mobile App Prototype", lastModified: "2025-09-08" },
        { id: "3", name: "Algorithm Experiments", lastModified: "2025-09-05" },
    ];

    const renderProjectItem = ({ item }) => (
        <TouchableOpacity
            style={styles.projectItem}
            onPress={() =>
                navigation.navigate("Editor", { projectId: item.id })
            }
        >
            <Text style={styles.projectName}>{item.name}</Text>
            <Text style={styles.projectDate}>
                Last modified: {item.lastModified}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>KODEON Mobile IDE</Text>

            <TouchableOpacity
                style={styles.newProjectButton}
                onPress={() => navigation.navigate("NewProject")}
            >
                <Text style={styles.buttonText}>Create New Project</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Recent Projects</Text>

            <FlatList
                data={recentProjects}
                renderItem={renderProjectItem}
                keyExtractor={(item) => item.id}
                style={styles.projectList}
            />

            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => navigation.navigate("Settings")}
            >
                <Text style={styles.settingsButtonText}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#1e1e1e",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
        marginVertical: 20,
    },
    newProjectButton: {
        backgroundColor: "#007acc",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 20,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
        marginTop: 20,
        marginBottom: 10,
    },
    projectList: {
        flex: 1,
    },
    projectItem: {
        backgroundColor: "#2d2d2d",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    projectName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff",
    },
    projectDate: {
        fontSize: 14,
        color: "#cccccc",
        marginTop: 5,
    },
    settingsButton: {
        padding: 15,
        alignItems: "center",
        marginVertical: 10,
    },
    settingsButtonText: {
        color: "#007acc",
        fontSize: 16,
    },
});

export default HomeScreen;
