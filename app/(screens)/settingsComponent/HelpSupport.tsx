import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { Stack, useRouter } from "expo-router";

export default function HelpSupportScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen
                options={{
                    headerShown: false,
                    headerStyle: { backgroundColor: "transparent" },
                    headerTransparent: true,
                }}
            />

            <TouchableOpacity
                style={styles.optionContainer}
                onPress={() =>
                    router.push(
                        "/(screens)/settingsComponent/helpSupportComponents/SendFeedBack"
                    )
                }
            >
                <Text style={styles.optionText}>Send Feedback</Text>
                <Text style={styles.subtitleText}>
                    Tell us what you love about us, or what we could be doing
                    better.
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.optionContainer}
                onPress={() => router.push("/")}
            >
                <Text style={styles.optionText}>Customer Support</Text>
                <Text style={styles.subtitleText}>
                    Have a query? Get instant help from our customer support
                    team
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionContainer}>
                <Text style={styles.optionText}>Common FAQ's</Text>
                <Text style={styles.subtitleText}>
                    Find answers to common questions about subscriptions,
                    payments, deliveries, and more.
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: 20,
        paddingHorizontal: 15
    },
    optionContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    optionText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    subtitleText: {
        fontSize: 14,
        color: "gray",
        marginTop: 5,
    },
});
