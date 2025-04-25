import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "@tanstack/react-query";
import { createManager } from "../api/postApi/postApi";

const AddManager = () => {
    const router = useRouter();

    const [managerData, setManagerData] = useState({
        name: "",
        phone: "",
        email: "",
        dateOfBirth: "",
        gender: "Male",
        branch: "",
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: createManager,
        onSuccess: (data) => {
            Alert.alert("Success", "Manager created successfully");
            router.back();
        },
        onError: (error: any) => {
            console.error("Error creating manager:", error);

            let errorMessage = "Failed to create manager";

            try {
                if (error.message && error.message.includes("HTTP 400:")) {
                    const jsonStr = error.message.split("HTTP 400:")[1];
                    const parsedError = JSON.parse(jsonStr);
                    errorMessage = parsedError.message;
                } else if (error?.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } catch (e) {
                errorMessage = error.message || "An unexpected error occurred";
            }

            Alert.alert("Validation Error", errorMessage, [
                { text: "OK", style: "cancel" },
            ]);
        },
    });

    const handleInputChange = (field: string, value: string) => {
        setManagerData({
            ...managerData,
            [field]: value,
        });
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString();
            setManagerData({
                ...managerData,
                dateOfBirth: formattedDate,
            });
        }
    };

    const toggleGenderPicker = () => {
        setShowGenderPicker(!showGenderPicker);
    };

    const selectGender = (gender: string) => {
        setManagerData({
            ...managerData,
            gender,
        });
        setShowGenderPicker(false);
    };

    const handleAddManager = () => {
        if (!managerData.name.trim()) {
            return Alert.alert("Error", "Name is required");
        }
        if (!managerData.phone.trim()) {
            return Alert.alert("Error", "Phone number is required");
        }
        if (!managerData.email.trim()) {
            return Alert.alert("Error", "Email is required");
        }
        if (!managerData.branch.trim()) {
            return Alert.alert("Error", "Branch is required");
        }

        mutate(managerData);
    };

    const getFormattedDateForDisplay = () => {
        if (!managerData.dateOfBirth) return "";

        const date = new Date(managerData.dateOfBirth);
        return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color="#FFA500" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Manager</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.fieldLabel}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={managerData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    placeholder="Enter name"
                />

                <Text style={styles.fieldLabel}>Phone</Text>
                <TextInput
                    style={styles.input}
                    value={managerData.phone}
                    onChangeText={(text) => handleInputChange("phone", text)}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                />

                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={managerData.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.fieldLabel}>Date Of Birth</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <View style={styles.datePickerButton}>
                        <TextInput
                            style={styles.dateInput}
                            value={getFormattedDateForDisplay()}
                            placeholder="DD/MM/YYYY"
                            editable={false}
                        />
                        <Ionicons
                            name="calendar-outline"
                            size={24}
                            color="#FFA500"
                        />
                    </View>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <Text style={styles.fieldLabel}>Gender</Text>
                <TouchableOpacity onPress={toggleGenderPicker}>
                    <View style={styles.dropdownButton}>
                        <Text style={styles.dropdownText}>
                            {managerData.gender || "Select Gender"}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#888" />
                    </View>
                </TouchableOpacity>

                {showGenderPicker && (
                    <View style={styles.genderPicker}>
                        <TouchableOpacity
                            style={styles.genderOption}
                            onPress={() => selectGender("Male")}
                        >
                            <Text style={styles.genderOptionText}>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.genderOption}
                            onPress={() => selectGender("Female")}
                        >
                            <Text style={styles.genderOptionText}>Female</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.genderOption}
                            onPress={() => selectGender("Other")}
                        >
                            <Text style={styles.genderOptionText}>Other</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <Text style={styles.fieldLabel}>Branch</Text>
                <TextInput
                    style={styles.input}
                    value={managerData.branch}
                    onChangeText={(text) => handleInputChange("branch", text)}
                    placeholder="Enter branch location"
                />

                <TouchableOpacity
                    style={[
                        styles.addButton,
                        isPending && styles.disabledButton,
                    ]}
                    onPress={handleAddManager}
                    disabled={isPending}
                >
                    {isPending ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.addButtonText}>ADD MANAGER</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F5",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFA500",
    },
    content: {
        flex: 1,
        padding: 16,
        backgroundColor: "#F9F9F9",
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: "500",
        marginTop: 16,
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    datePickerButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        paddingRight: 12,
    },
    dateInput: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: "#000000",
    },
    dropdownButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        padding: 12,
    },
    dropdownText: {
        fontSize: 16,
        color: "#000000",
    },
    genderPicker: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        marginTop: 4,
    },
    genderOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    genderOptionText: {
        fontSize: 16,
    },
    addButton: {
        backgroundColor: "#FFA500",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
        marginTop: 32,
        marginBottom: 24,
    },
    addButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    disabledButton: {
        backgroundColor: "#FFD180",
    },
});

export default AddManager;
