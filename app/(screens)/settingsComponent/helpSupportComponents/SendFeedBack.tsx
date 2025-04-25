import { Stack } from "expo-router";
import React, { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from "react-native";

export default function SendFeedBack() {
    const [comment, setComment] = useState("");

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
            <Text style={styles.title}>Add Your Feedback Here!</Text>
            <TextInput
                style={styles.textInput}
                multiline
                maxLength={150}
                placeholder="Your comment..."
                value={comment}
                onChangeText={setComment}
            />
            <TouchableOpacity style={styles.sendButton}>
                <Text style={styles.sendButtonText}>SEND FEEDBACK</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        minHeight: 100,
        textAlignVertical: "top",
        padding: 10,
        marginBottom: 15,
    },
    sendButton: {
        backgroundColor: "#FFC300",
        padding: 15,
        alignItems: "center",
        borderRadius: 5,
    },
    sendButtonText: {
        color: "black",
        fontWeight: "bold",
    },
});
