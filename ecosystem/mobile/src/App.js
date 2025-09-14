import { StyleSheet, View } from "react-native";
import HomeScreen from "../components/HomeScreen";

const App = () => {
    // For now, we'll just render a basic structure
    // In a real implementation, this would manage navigation between screens
    return (
        <View style={styles.container}>
            {/* This would be replaced with proper navigation */}
            <HomeScreen />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1e1e1e",
    },
});

export default App;
