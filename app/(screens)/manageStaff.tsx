import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
} from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const ManageStaff = () => {
    type ManagerStaff = {
        heading: string;
        icon:
            | "chevron-forward-outline"
            | "filter"
            | "infinite"
            | "text"
            | "key"
            | "push"
            | "map"
            | "at"
            | "link"
            | "search"
            | "image"
            | "alert"
            | "checkbox"
            | "menu"
            | "radio"
            | "timer"
            | "close";
        description?: string;
    };

    const router = useRouter();

    const manageStaff: ManagerStaff[] = [
        {
            heading: "DELIVERY PARTNERS",
            icon: "chevron-forward-outline",
            description: "Manage your delivery partner list",
        },
        {
            heading: "MANAGERS",
            icon: "chevron-forward-outline",
            description: "Manage your kitchen managers",
        },
        {
            heading: "ASSIGN DELIVERY SLOTS",
            icon: "chevron-forward-outline",
            description: "Assign delivery slots to partners",
        },
    ];

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                    headerStyle: { backgroundColor: "transparent" },
                    headerTransparent: true,
                }}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons
                            name="chevron-back-outline"
                            size={24}
                            color={Colors.secondary}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Manage Staff</Text>
                    <View style={styles.headerRight} />
                </View>

                <View style={styles.manageStaffContainer}>
                    {manageStaff.map((list, id) => (
                        <TouchableOpacity
                            key={id}
                            style={styles.cardContainer}
                            onPress={() => {
                                if (list.heading === "DELIVERY PARTNERS") {
                                    router.push("/(screens)/PartnerList");
                                } else if (list.heading === "MANAGERS") {
                                    router.push("/(screens)/Managers");
                                } else if (
                                    list.heading === "ASSIGN DELIVERY SLOTS"
                                ) {
                                    router.push("/(screens)/AssignSlot");
                                }
                            }}
                        >
                            <View style={styles.cardContent}>
                                <View>
                                    <Text style={styles.listHeading}>
                                        {list.heading}
                                    </Text>
                                    <Text style={styles.listDescription}>
                                        {list.description}
                                    </Text>
                                </View>
                                <Ionicons
                                    name={list.icon}
                                    size={20}
                                    color={Colors.secondary}
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 16,
    },
    backButton: {
        padding: 16,
    },
    manageStaffContainer: {
        marginTop: 20,
        gap: 16,
        padding: 10,
    },
    cardContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.15,
                shadowRadius: 5,
                padding: 16,
            },
            android: {
                elevation: 4,
                shadowColor: "#000",
            },
        }),
        borderLeftWidth: 4,
        borderLeftColor: Colors.secondary,
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    listHeading: {
        fontFamily: "nunito-b",
        fontSize: 16,
        color: Colors.primary,
        marginBottom: 4,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F5",
    },
    headerTitle: {
        fontFamily: "nunito-b",
        fontSize: 26,
        fontWeight: "bold",
        color: "#FFA500",
        flex: 1,
        textAlign: "center",
    },
    headerRight: {
        width: 40,
    },
    listDescription: {
        fontFamily: "nunito",
        fontSize: 14,
        color: "#666666",
    },
});

export default ManageStaff;
