import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchMyMeals, getAllDeliveryPartners } from "../api/getApi/getApi";
import { AssignSlot as assignSlotApi } from "../api/postApi/postApi";
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from 'react-native-dropdown-picker';

interface Meal {
    _id: string;
    mealTitle: string;
    mealType: string;
    startTime: string;
    endTime: string;
    imageUrl: string;
    mealItems: string[];
    kitchenPartnerId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface DeliveryPartner {
    _id: string;
    name: string;
    phone: string;
    email: string;
    isActive: boolean;
    assignedSlots: string[];
}

const AssignSlot = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [kitchenPartnerId, setKitchenPartnerId] = useState<string>("");

    const [selectedMealType, setSelectedMealType] = useState("Breakfast");
    const [selectedMeal, setSelectedMeal] = useState("");
    const [selectedPartner, setSelectedPartner] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [mealTypeOpen, setMealTypeOpen] = useState(false);
    const [mealTitleOpen, setMealTitleOpen] = useState(false);
    const [partnerOpen, setPartnerOpen] = useState(false);
    const [slotOpen, setSlotOpen] = useState(false);

    useEffect(() => {
        const fetchKitchenPartnerId = async () => {
            try {
                const storedData = await AsyncStorage.getItem("data");
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    setKitchenPartnerId(parsedData.kitchenPartner?.id || "");
                }
            } catch (error) {
                console.error("Error fetching kitchenPartnerId:", error);
            }
        };

        fetchKitchenPartnerId();
    }, []);

    const { data: mealsData, isLoading: mealsLoading } = useQuery({
        queryKey: ["meals", kitchenPartnerId],
        queryFn: () => fetchMyMeals(kitchenPartnerId),
        enabled: !!kitchenPartnerId,
    });

    const { data: partnersData, isLoading: partnersLoading } = useQuery({
        queryKey: ["deliveryPartners"],
        queryFn: getAllDeliveryPartners,
    });

    const meals = mealsData?.data || [];
    const deliveryPartners = partnersData?.data || [];

    const filteredMeals = meals.filter(
        (meal: Meal) => meal.mealType === selectedMealType
    );
    const selectedMealData = filteredMeals.find(
        (meal: Meal) => meal._id === selectedMeal
    );

    //   console.log('Meals Data:', mealsData);
    //   console.log('Meals:', meals);
    //   console.log('Filtered Meals:', filteredMeals);
    //   console.log('Selected Meal Data:', selectedMealData);
    //   console.log('Selected Meal Start Time:', selectedMealData?.startTime);
    //   console.log('Selected Meal End Time:', selectedMealData?.endTime);

    const formatTime = (timeString: string) => {
        if (!timeString) return "";
        try {
            const date = new Date(timeString);
            return date.toLocaleString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } catch (error) {
            console.error("Error formatting time:", error);
            return timeString;
        }
    };

    const handleAddSlot = () => {
        // TODO: Implement slot addition logic
    };

    const handleAssignSlot = async () => {
        if (!selectedPartner || !selectedSlot) {
            Alert.alert(
                "Error",
                "Please select both a delivery partner and a slot"
            );
            return;
        }
        const assignedPartner = deliveryPartners.find(
            (partner: DeliveryPartner) =>
                partner.assignedSlots.includes(selectedSlot)
        );

        // if (assignedPartner && assignedPartner._id == selectedPartner) {
        //     Alert.alert(
        //         "Error",
        //         "This slot is aleardy assigned to this delivery partner",
        //         [{ text: "OK" }]
        //     );
        //     return;
        // }
        try {
            const result = await assignSlotApi(selectedPartner, selectedSlot);
            if (result) {
                Alert.alert("Success", "Slot assigned successfully");
                // Reset selections
                setSelectedPartner("");
                setSelectedSlot("");
                setSelectedMeal("");
            } else {
                Alert.alert("Error", "Failed to assign slot");
            }
        } catch (error: any) {
            console.error("Error assigning slot:", error);

            // Parse the error message from the response
            let errorMessage = "An unexpected error occurred";

            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (typeof error.message === "string") {
                errorMessage = error.message.replace(/HTTP \d+:/, "").trim();
                try {
                    const parsedError = JSON.parse(errorMessage);
                    if (parsedError.error) {
                        errorMessage = parsedError.error;
                    }
                } catch (e) {
                }
            }

            Alert.alert("Error", errorMessage, [{ text: "OK" }]);
        }
    };

    if (mealsLoading || partnersLoading) {
        return (
            <SafeAreaView style={styles.container}>
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
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Assign Delivery Slots</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.formContainer}>
                    {/* Meal Type Picker */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Meal Type</Text>
                        <DropDownPicker
                            open={mealTypeOpen}
                            value={selectedMealType}
                            items={[
                                { label: 'Breakfast', value: 'Breakfast' },
                                { label: 'Lunch', value: 'Lunch' },
                                { label: 'Dinner', value: 'Dinner' }
                            ]}
                            setOpen={setMealTypeOpen}
                            setValue={setSelectedMealType}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                            placeholder="Select Meal Type"
                            zIndex={4000}
                        />
                    </View>

                    {/* Replace Meal Title Picker */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Meal Title</Text>
                        <DropDownPicker
                            open={mealTitleOpen}
                            value={selectedMeal}
                            items={filteredMeals.map((meal: Meal) => ({
                                label: meal.mealTitle,
                                value: meal._id
                            }))}
                            setOpen={setMealTitleOpen}
                            setValue={setSelectedMeal}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                            placeholder="Select Meal"
                            zIndex={3000}
                        />
                    </View>

                    {/* Replace Delivery Partner Picker */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Select Delivery Partner</Text>
                        <DropDownPicker
                            open={partnerOpen}
                            value={selectedPartner}
                            items={deliveryPartners
                                .filter((partner: DeliveryPartner) => partner.isActive)
                                .map((partner: DeliveryPartner) => ({
                                    label: `${partner.name} (${partner.phone})`,
                                    value: partner._id
                                }))}
                            setOpen={setPartnerOpen}
                            setValue={setSelectedPartner}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                            placeholder="Select Partner"
                            zIndex={2000}
                        />
                    </View>

                    {/* Replace Time Slot Picker */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Choose Slot</Text>
                        <DropDownPicker
                            open={slotOpen}
                            value={selectedSlot}
                            items={selectedMealData ? [{
                                label: `${formatTime(selectedMealData.startTime)} - ${formatTime(selectedMealData.endTime)}`,
                                value: selectedMealData._id
                            }] : []}
                            setOpen={setSlotOpen}
                            setValue={setSelectedSlot}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                            placeholder="Select Slot"
                            zIndex={1000}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddSlot}
                    >
                        <Text style={styles.addButtonText}>ADD SLOT</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={styles.assignButton}
                onPress={handleAssignSlot}
            >
                <Text style={styles.assignButtonText}>ASSIGN SLOT</Text>
            </TouchableOpacity>
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
        borderBottomColor: "#EEEEEE",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    content: {
        flex: 1,
        padding: 16,
    },
    formContainer: {
        flex: 1,
    },
    fieldContainer: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 14,
        color: "#888888",
        marginBottom: 4,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 4,
        overflow: "hidden",
        zIndex: 10,
    },
    picker: {
        height: 50,
        width: "100%",
    },
    addButton: {
        backgroundColor: "#FFA500",
        padding: 12,
        borderRadius: 4,
        alignItems: "center",
        marginTop: 16,
    },
    addButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    assignButton: {
        backgroundColor: "#FFA500",
        padding: 16,
        margin: 16,
        borderRadius: 4,
        alignItems: "center",
    },
    assignButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    dropdown: {
        borderColor: '#DDDDDD',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        minHeight: 50,
    },
    dropdownContainer: {
        borderColor: '#DDDDDD',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
    },
});

export default AssignSlot;
