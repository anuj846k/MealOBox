import React from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";

const AccountSettings = () => {
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
                <TouchableOpacity onPress={() => {}} style={styles.backButton}>
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color="#FFC107"
                        onPress={() => router.back()}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Settings</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <View style={styles.tabActive}>
                    <Text style={styles.tabActiveText}>General</Text>
                </View>
                <View style={styles.tab}>
                    <Text style={styles.tabText}>Password</Text>
                </View>
            </View>

            <ScrollView style={styles.formContainer}>
                <Text style={styles.inputLabel}>Business Name</Text>
                <TextInput
                    style={styles.input}
                    value="Rajat Patidar"
                    placeholderTextColor="#999"
                />

                <View style={styles.rowContainer}>
                    <View style={styles.halfColumn}>
                        <Text style={styles.inputLabel}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            value="08080 80808"
                            keyboardType="phone-pad"
                            placeholderTextColor="#999"
                        />
                    </View>
                    <View style={styles.halfColumn}>
                        <Text style={styles.inputLabel}>Whatsapp No.</Text>
                        <TextInput
                            style={styles.input}
                            value="08080 80808"
                            keyboardType="phone-pad"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                    style={styles.input}
                    value="rajat@gmail.com"
                    keyboardType="email-address"
                    placeholderTextColor="#999"
                />

                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                    style={styles.textArea}
                    value="House No:558, Street No:1, Madanpuri, Near Patudi Chowk"
                    multiline
                    numberOfLines={2}
                    placeholderTextColor="#999"
                />

                <Text style={styles.inputLabel}>Max km. For Delivery</Text>
                <TouchableOpacity style={styles.dropdownInput}>
                    <Text>10</Text>
                    <Ionicons name="chevron-down" size={16} color="#888" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.imageContainer}>
                    <Image
                        source={{
                            uri: "https://cdn.pixabay.com/photo/2017/06/06/22/46/mediterranean-cuisine-2378758_1280.jpg",
                        }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <TouchableOpacity style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>
                </TouchableOpacity>

                <TouchableOpacity style={styles.updateButton}>
                    <Text style={styles.updateButtonText}>UPDATE</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AccountSettings;

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
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 16,
        color: "#FFC107",
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#FFC107",
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
    },
    tabActive: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: "#FFFFFF",
    },
    tabText: {
        color: "#FFFFFF",
        fontSize: 16,
        opacity: 0.8,
    },
    tabActiveText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    formContainer: {
        flex: 1,
        padding: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#FFC107",
        borderRadius: 4,
        padding: 10,
        marginBottom: 5,
        backgroundColor: "#FFFFFF",
    },
    textArea: {
        borderWidth: 1,
        borderColor: "#FFC107",
        borderRadius: 4,
        padding: 10,
        marginBottom: 5,
        backgroundColor: "#FFFFFF",
        height: 60,
        textAlignVertical: "top",
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    halfColumn: {
        width: "48%",
    },
    dropdownInput: {
        borderWidth: 1,
        borderColor: "#FFC107",
        borderRadius: 4,
        padding: 10,
        marginBottom: 5,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    imageContainer: {
        borderWidth: 1,
        borderColor: "#FFC107",
        borderRadius: 4,
        marginVertical: 10,
        overflow: "hidden",
        position: "relative",
    },
    image: {
        width: "100%",
        height: 120,
    },
    closeButton: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "rgba(255,255,255,0.7)",
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    updateButton: {
        backgroundColor: "#FFC107",
        padding: 15,
        borderRadius: 4,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    updateButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
