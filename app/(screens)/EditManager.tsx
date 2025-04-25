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
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getManagerById } from "../api/getApi/getApi";
import { updateManager } from "../api/updateApi/updateApi";

interface Manager {
    _id: string;
    name: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    branch: string;
    isActive: boolean;
}

const EditManager = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const queryClient = useQueryClient();

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    // Query to get manager details
    const { data, isLoading: isLoadingManager } = useQuery({
        queryKey: ["manager", id],
        queryFn: () => getManagerById(id as string),
        enabled: !!id,
    });

    // Get manager from the response 
    const manager = data?.message;

    // Initialize form data with manager details when they load
    const [managerData, setManagerData] = useState<Partial<Manager>>({
        name: manager?.name || "",
        phone: manager?.phone || "",
        email: manager?.email || "",
        dateOfBirth: manager?.dateOfBirth || "",
        gender: manager?.gender || "",
        branch: manager?.branch || "",
        isActive: manager?.isActive !== undefined ? manager.isActive : true,
    });

    // Update form data when manager data loads
    React.useEffect(() => {
        if (manager) {
            setManagerData({
                name: manager.name,
                phone: manager.phone,
                email: manager.email,
                dateOfBirth: manager.dateOfBirth,
                gender: manager.gender,
                branch: manager.branch,
                isActive: manager.isActive,
            });
        }
    }, [manager]);

    const updateMutation = useMutation({
        mutationFn: (data: Partial<Manager>) => updateManager(id as string, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["manager", id] });
            queryClient.invalidateQueries({ queryKey: ["managers"] });
            Alert.alert("Success", "Manager updated successfully");
            router.back();
        },
        onError: (error: any) => {
            Alert.alert("Error", error.message || "Failed to update manager");
        },
    });

    const handleInputChange = (field: string, value: string | boolean) => {
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

    const handleSave = () => {
        // Validation
        if (!managerData.name?.trim()) {
            return Alert.alert("Error", "Name is required");
        }
        if (!managerData.phone?.trim()) {
            return Alert.alert("Error", "Phone number is required");
        }
        if (!managerData.email?.trim()) {
            return Alert.alert("Error", "Email is required");
        }
        if (!managerData.branch?.trim()) {
            return Alert.alert("Error", "Branch is required");
        }

        // Only include fields that have changed
        const changedData: Partial<Manager> = {};
        if (managerData.name !== manager?.name) changedData.name = managerData.name;
        if (managerData.phone !== manager?.phone) changedData.phone = managerData.phone;
        if (managerData.email !== manager?.email) changedData.email = managerData.email;
        if (managerData.dateOfBirth !== manager?.dateOfBirth) changedData.dateOfBirth = managerData.dateOfBirth;
        if (managerData.gender !== manager?.gender) changedData.gender = managerData.gender;
        if (managerData.branch !== manager?.branch) changedData.branch = managerData.branch;
        if (managerData.isActive !== manager?.isActive) changedData.isActive = managerData.isActive;

        // Update manager only if there are changes
        if (Object.keys(changedData).length > 0) {
            updateMutation.mutate(changedData);
        } else {
            Alert.alert("Info", "No changes detected");
        }
    };

    // Format date for display
    const getFormattedDateForDisplay = () => {
        if (!managerData.dateOfBirth) return "";
        try {
            const date = new Date(managerData.dateOfBirth);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (error) {
            return "";
        }
    };

    if (isLoadingManager) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={24} color="#FFA500" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Manager</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFA500" />
                </View>
            </SafeAreaView>
        );
    }

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
                <Text style={styles.headerTitle}>Edit Manager</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Name Input */}
                <Text style={styles.fieldLabel}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={managerData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    placeholder="Enter name"
                />

                {/* Phone Input */}
                <Text style={styles.fieldLabel}>Phone</Text>
                <TextInput
                    style={styles.input}
                    value={managerData.phone}
                    onChangeText={(text) => handleInputChange("phone", text)}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                />

                {/* Email Input */}
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={managerData.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* Date of Birth Input */}
                <Text style={styles.fieldLabel}>Date Of Birth</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <View style={styles.datePickerButton}>
                        <TextInput
                            style={styles.dateInput}
                            value={getFormattedDateForDisplay()}
                            placeholder="DD/MM/YYYY"
                            editable={false}
                        />
                        <Ionicons name="calendar-outline" size={24} color="#FFA500" />
                    </View>
                </TouchableOpacity>
                
                {showDatePicker && (
                    <DateTimePicker
                        value={managerData.dateOfBirth ? new Date(managerData.dateOfBirth) : new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                {/* Gender Input */}
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

                {/* Branch Input */}
                <Text style={styles.fieldLabel}>Branch</Text>
                <TextInput
                    style={styles.input}
                    value={managerData.branch}
                    onChangeText={(text) => handleInputChange("branch", text)}
                    placeholder="Enter branch location"
                />

                <TouchableOpacity
                    style={[styles.saveButton, updateMutation.isPending && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={updateMutation.isPending}
                >
                    {updateMutation.isPending ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
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
    saveButton: {
        backgroundColor: "#FFA500",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
        marginTop: 32,
        marginBottom: 24,
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    disabledButton: {
        backgroundColor: "#FFD180",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default EditManager;