import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

const Divider = () => {
    return (
        <View style={styles.container}>
            <View style={styles.divider}></View>
        </View>
    );
};

export default Divider;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    divider: {
        width: "100%",
        height: 1,
        backgroundColor: Colors.secondary,
    },
});
