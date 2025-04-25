import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";

const ProfileList = () => {
    type ProfileListItem = {
        heading: string;
        subHeading: string;
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
        path: string;
    };

    const profileLists: ProfileListItem[] = [
        {
            heading: "Manage Staff",
            subHeading: "Add or update staff details, assign delivery slots",
            icon: "chevron-forward-outline",
            path: "manageStaff",
        },
        {
            heading: "My Earnings",
            subHeading: "Track earnings on weekly basis, add auto payment",
            icon: "chevron-forward-outline",
            path: "Earnings",
        },
        {
            heading: "Payment Method",
            subHeading: "Add or update your bank details",
            icon: "chevron-forward-outline",
            path: "PaymentMethod",
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.profileListContainer}>
                {profileLists.map((list, id) => {
                    return (
                        <View key={id} style={styles.card}>
                            <Link href={`/(screens)/${list.path}` as any}>
                                <View style={styles.profileList}>
                                    <View style={styles.textBlock}>
                                        <Text style={styles.profileListHeading}>
                                            {list.heading}
                                        </Text>
                                        <Text style={styles.subHeading}>
                                            {list.subHeading}
                                        </Text>
                                    </View>

                                    <Ionicons
                                        name={list.icon}
                                        size={20}
                                        color={Colors.secondary}
                                    />
                                </View>
                            </Link>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default ProfileList;

const styles = StyleSheet.create({
    container: {
        marginTop: 29,
        paddingHorizontal: 24,
    },
    profileListContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 20,
        width: "100%",
    },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    profileList: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    textBlock: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 3,
        flex: 1,
        paddingRight: 10,
    },
    profileListHeading: {
        fontFamily: "nunito-b",
        fontSize: 16,
        color: "#222",
    },
    subHeading: {
        fontSize: 13,
        color: "#666",
        lineHeight: 18,
    },
});
