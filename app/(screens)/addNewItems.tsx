import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";

export default function AddNewItemScreen() {
    const router = useRouter();
    const [itemName, setItemName] = useState("");
    const [kitchenPartnerId, setKitchenPartnerId] = useState<string | null>(
        null
    );
    const [selectedMeals, setSelectedMeals] = useState({
        Breakfast: false,
        Lunch: false,
        Dinner: false,
    });

    useEffect(() => {
        const fetchKitchenPartnerId = async () => {
            try {
                const storedData = await AsyncStorage.getItem("data");
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    setKitchenPartnerId(parsedData.kitchenPartner?.id || null);
                    console.log(parsedData.kitchenPartner?.id || null);
                }
            } catch (error) {
                console.error("Error fetching kitchenPartnerId:", error);
            }
        };

        fetchKitchenPartnerId();
    }, []);

    // Mutation to send data to the backend
    interface NewItem {
        name: string;
        type: string;
        kitchenPartnerId: string;
    }

    const mutation = useMutation({
        mutationFn: async (newItem: NewItem) => {
            try {
                const storedData = await AsyncStorage.getItem("data");

                console.log("storeData", storedData);

                if (!storedData) {
                    throw new Error("Authentication details not found.");
                }

                const { kitchenPartner } = JSON.parse(storedData);

                const response = await fetch(
                    `${process.env.API_URL}/api/v1/admin/create-meal`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: newItem.name,
                            type: newItem.type,
                            kitchenPartnerId: kitchenPartner.id, // Use correct ID
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to add item");
                }

                return response.json();
            } catch (error) {
                throw new Error(
                    error instanceof Error ? error.message : String(error)
                );
            }
        },
        onSuccess: () => {
            Alert.alert("Success", "Item added successfully!");
            router.back();
        },
        onError: (error) => {
            Alert.alert("Error", error.message || "Something went wrong");
        },
    });

    const toggleMealType = (meal: keyof typeof selectedMeals) => {
        const selectedCount = Object.values(selectedMeals).filter(
            (value) => value
        ).length;

        if (selectedMeals[meal] && selectedCount === 1) {
            Alert.alert("Warning", "At least one meal type must be selected.", [
                { text: "OK", style: "default" },
            ]);
            return;
        }

        setSelectedMeals((prevState) => ({
            Breakfast: false,
            Lunch: false,
            Dinner: false,
            [meal]: !prevState[meal],
        }));
    };

    const handleAddItem = () => {
        const selectedMealType = Object.keys(selectedMeals).find(
            (meal) => selectedMeals[meal as keyof typeof selectedMeals]
        );

        if (!itemName.trim()) {
            Alert.alert("Error", "Item name cannot be empty.");
            return;
        }

        if (!selectedMealType) {
            Alert.alert("Error", "Please select a meal type.");
            return;
        }

        if (!kitchenPartnerId) {
            Alert.alert("Error", "Kitchen Partner ID not found.");
            return;
        }

        mutation.mutate({
            name: itemName,
            type: selectedMealType,
            kitchenPartnerId,
        });
    };

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

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color="#FFC107" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add a New Item</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Item Name</Text>
                    <TextInput
                        style={styles.textInput}
                        value={itemName}
                        onChangeText={setItemName}
                        placeholder="Enter item name"
                    />
                </View>

                <View style={styles.inputSection}>
                    <Text style={styles.label}>Select Meal Type</Text>

                    <View style={styles.checkboxesContainer}>
                        <View style={styles.checkboxRow}>
                            <Text style={styles.checkboxLabel}>Breakfast</Text>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => toggleMealType("Breakfast")}
                            >
                                {selectedMeals.Breakfast && (
                                    <Ionicons
                                        name="checkmark"
                                        size={18}
                                        color="#FFC107"
                                    />
                                )}
                            </TouchableOpacity>

                            <Text style={styles.checkboxLabel}>Lunch</Text>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => toggleMealType("Lunch")}
                            >
                                {selectedMeals.Lunch && (
                                    <Ionicons
                                        name="checkmark"
                                        size={18}
                                        color="#FFC107"
                                    />
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.checkboxRow}>
                            <Text style={styles.checkboxLabel}>Dinner</Text>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => toggleMealType("Dinner")}
                            >
                                {selectedMeals.Dinner && (
                                    <Ionicons
                                        name="checkmark"
                                        size={18}
                                        color="#FFC107"
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Add Item Button */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddItem}
                    disabled={mutation.isPending}
                >
                    <Text style={styles.addButtonText}>
                        {mutation.isPending ? "ADDING..." : "ADD ITEM"}
                    </Text>
                </TouchableOpacity>
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
        paddingTop: 12,
        paddingBottom: 8,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        color: "#FFC107",
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 8,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        backgroundColor: "#FFF9E6",
    },
    inputSection: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#FFE082",
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    checkboxesContainer: {
        marginTop: 8,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    checkboxLabel: {
        fontSize: 16,
        color: "#333333",
        width: 80,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: "#FFE082",
        borderRadius: 2,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 24,
    },
    addButton: {
        backgroundColor: "#FFC107",
        paddingVertical: 14,
        borderRadius: 4,
        alignItems: "center",
    },
    addButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
});
