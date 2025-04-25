import React from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";

export default function SettingsScreen() {
    const settingsOptions = [
        {
            title: "Account Settings",
            subtitle: "Update your business details and password",
            iconName: "chevron-forward",
            onPress: () =>
                router.push("/(screens)/settingsComponent/AccountSettings"),
        },
        {
            title: "About Us",
            subtitle: "Know more about the MealQBox family",
            iconName: "chevron-forward",
            path: "accountSettings",
        },
        {
            title: "Privacy Policy",
            subtitle: "How we collect, use, and protect your data",
            iconName: "chevron-forward",
            path: "accountSettings",
        },
        {
            title: "Terms and Conditions",
            subtitle: "Guidelines for using our service",
            iconName: "chevron-forward",
            path: "accountSettings",
        },
        {
            title: "Notification Settings",
            subtitle: "Choose what emails and notifications you want to see",
            iconName: "chevron-forward",
            path: "accountSettings",
        },
        {
            title: "App Permissions",
            subtitle: "Open your phone settings",
            iconName: "chevron-forward",
            path: "accountSettings",
        },
        {
            title: "Help & Support",
            subtitle: "Need Help? Go through FAQ's or Contact us",
            iconName: "chevron-forward",
            onPress: () =>
                router.push("/(screens)/settingsComponent/HelpSupport"),
        },
    ];

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

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        router.back();
                    }}
                >
                    <Ionicons name="chevron-back" size={28} color="#FFC107" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            {/* Settings List */}
            <View style={styles.settingsContainer}>
                {settingsOptions.map((item, index) => (
                    <React.Fragment key={index}>
                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={item.onPress}
                        >
                            <View style={styles.settingContent}>
                                <Text style={styles.settingTitle}>
                                    {item.title}
                                </Text>
                                <Text style={styles.settingSubtitle}>
                                    {item.subtitle}
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#D3D3D3"
                            />
                        </TouchableOpacity>
                        {index < settingsOptions.length - 1 && (
                            <View style={styles.divider} />
                        )}
                    </React.Fragment>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 24,
        color: "#FFC107",
    },
    settingsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#212121",
        marginBottom: 4,
    },
    settingSubtitle: {
        fontSize: 12,
        color: "#757575",
    },
    divider: {
        height: 1,
        backgroundColor: "#F0F0F0",
    },
});
