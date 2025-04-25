import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router } from "expo-router";

const ProfileHeader = () => {
    return (
        <View style={styles.container}>
            <Ionicons
                name="chevron-back-outline"
                size={20}
                color={Colors.secondary}
                onPress={() => router.back()}
            />
            <Text style={styles.headerText}>My Profile</Text>
        </View>
    );
};

export default ProfileHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    headerText: {
        fontFamily: "nunito-b",
        fontSize: 20,
        color: Colors.secondary,
    },
});
