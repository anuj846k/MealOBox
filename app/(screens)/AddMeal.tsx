import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    Platform,
    Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchMeals } from "../api/getApi/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const AddMeal = () => {
    const router = useRouter();
    const [mealImage, setMealImage] = useState(null);
    const [kitchenPartnerId, setKitchenPartnerId] = useState<string>("");
    const [selectedMealItems, setSelectedMealItems] = useState<string[]>([]);

    // Dropdown state management
    const [mealType, setMealType] = useState("Breakfast");
    const [mealTitle, setMealTitle] = useState("Monday Meal");
    const [showMealTypeDropdown, setShowMealTypeDropdown] = useState(false);
    const [showMealTitleDropdown, setShowMealTitleDropdown] = useState(false);

    // Time picker state
    const [startTime, setStartTime] = useState(
        new Date(new Date().setHours(7, 0, 0))
    );
    const [endTime, setEndTime] = useState(
        new Date(new Date().setHours(9, 0, 0))
    );
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    // Dropdown options
    const mealTypeOptions = ["Breakfast", "Lunch", "Dinner"];
    const mealTitleOptions = [
        "Monday Meal",
        "Tuesday Meal",
        "Wednesday Meal",
        "Thursday Meal",
        "Friday Meal",
        "Saturday Meal",
        "Sunday Meal",
    ];

    // Format time to display
    const formatTime = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        return `${hours}:${minutes}`;
    };

    // Get AM/PM for a date
    const getAmPm = (date: Date) => {
        return date.getHours() >= 12 ? "PM" : "AM";
    };

    // Handle time change
    const onTimeChange = (
        _event: any,
        selectedDate: Date | undefined,
        timeType: "start" | "end"
    ) => {
        if (Platform.OS === "android") {
            setShowStartTimePicker(false);
            setShowEndTimePicker(false);
        }

        if (selectedDate) {
            if (timeType === "start") {
                setStartTime(selectedDate);
            } else {
                setEndTime(selectedDate);
            }
        }
    };

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

    const { data } = useQuery({
        queryKey: ["getMeals"],
        queryFn: () => fetchMeals(kitchenPartnerId),
    });

    const mealItems = data?.meals || [];

    const createMealMutation = useMutation({
        mutationFn: async (mealData: any) => {
            const response = await fetch(
                `${process.env.API_URL}/api/v1/kitchen-partner/create-my-meal`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(mealData),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create meal");
            }

            return response.json();
        },
        onSuccess: () => {
            Alert.alert("Success", "Meal created successfully");
            router.back();
        },
        onError: (error) => {
            console.error("Error creating meal:", error);
            Alert.alert("Error", "Failed to create meal. Please try again.");
        },
    });

    const handleAddMealItem = (itemId: string, itemName: string) => {
        const isSelected = selectedMealItems.some((item) => item === itemName);

        if (!isSelected) {
            setSelectedMealItems((prevItems) => [...prevItems, itemName]);
        } else {
            setSelectedMealItems((prevItems) =>
                prevItems.filter((item) => item !== itemName)
            );
        }
    };

    const handleSubmit = () => {
        if (selectedMealItems.length === 0) {
            Alert.alert("Error", "Please select at least one meal item");
            return;
        }

        const mealData = {
            kitchenPartnerId,
            mealType: mealType,
            mealTitle: mealTitle,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            mealItems: selectedMealItems,
            imageUrl: mealImage || undefined,
        };

        // Log the data being sent to the backend
        console.log(
            "Sending meal data to backend:",
            JSON.stringify(mealData, null, 2)
        );

        createMealMutation.mutate(mealData);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                    headerStyle: { backgroundColor: "transparent" },
                    headerTransparent: true,
                }}
            />

            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color="#FFA500" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add a Meal</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Meal Type</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setShowMealTypeDropdown(true)}
                    >
                        <Text>{mealType}</Text>
                        <Ionicons name="chevron-down" size={20} color="#888" />
                    </TouchableOpacity>

                    {/* Meal Type Dropdown Modal */}
                    <Modal
                        visible={showMealTypeDropdown}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setShowMealTypeDropdown(false)}
                    >
                        <TouchableOpacity
                            style={styles.modalOverlay}
                            activeOpacity={1}
                            onPress={() => setShowMealTypeDropdown(false)}
                        >
                            <View style={styles.dropdownModal}>
                                <ScrollView style={styles.dropdownScroll}>
                                    {mealTypeOptions.map((option, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setMealType(option);
                                                setShowMealTypeDropdown(false);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.dropdownItemText,
                                                    mealType === option &&
                                                        styles.selectedDropdownItem,
                                                ]}
                                            >
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Meal Title</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setShowMealTitleDropdown(true)}
                    >
                        <Text>{mealTitle}</Text>
                        <Ionicons name="chevron-down" size={20} color="#888" />
                    </TouchableOpacity>

                    {/* Meal Title Dropdown Modal */}
                    <Modal
                        visible={showMealTitleDropdown}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setShowMealTitleDropdown(false)}
                    >
                        <TouchableOpacity
                            style={styles.modalOverlay}
                            activeOpacity={1}
                            onPress={() => setShowMealTitleDropdown(false)}
                        >
                            <View style={styles.dropdownModal}>
                                <ScrollView style={styles.dropdownScroll}>
                                    {mealTitleOptions.map((option, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setMealTitle(option);
                                                setShowMealTitleDropdown(false);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.dropdownItemText,
                                                    mealTitle === option &&
                                                        styles.selectedDropdownItem,
                                                ]}
                                            >
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Slot Timings</Text>
                    <View style={styles.timeContainer}>
                        <View style={styles.timeGroup}>
                            <Text style={styles.timeLabel}>Start:</Text>
                            <View style={styles.timeInputContainer}>
                                <TouchableOpacity
                                    style={styles.timeInput}
                                    onPress={() => setShowStartTimePicker(true)}
                                >
                                    <Text>{formatTime(startTime)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.amPmSelector}
                                    onPress={() => setShowStartTimePicker(true)}
                                >
                                    <Text>{getAmPm(startTime)}</Text>
                                </TouchableOpacity>
                            </View>
                            {showStartTimePicker && Platform.OS === "ios" && (
                                <DateTimePicker
                                    value={startTime}
                                    mode="time"
                                    is24Hour={false}
                                    display="spinner"
                                    onChange={(event, date) => {
                                        setShowStartTimePicker(false);
                                        onTimeChange(event, date, "start");
                                    }}
                                />
                            )}
                            {showStartTimePicker &&
                                Platform.OS === "android" && (
                                    <DateTimePicker
                                        value={startTime}
                                        mode="time"
                                        is24Hour={false}
                                        display="default"
                                        onChange={(event, date) => {
                                            setShowStartTimePicker(false);
                                            onTimeChange(event, date, "start");
                                        }}
                                    />
                                )}
                        </View>

                        <View style={styles.timeGroup}>
                            <Text style={styles.timeLabel}>End:</Text>
                            <View style={styles.timeInputContainer}>
                                <TouchableOpacity
                                    style={styles.timeInput}
                                    onPress={() => setShowEndTimePicker(true)}
                                >
                                    <Text>{formatTime(endTime)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.amPmSelector}
                                    onPress={() => setShowEndTimePicker(true)}
                                >
                                    <Text>{getAmPm(endTime)}</Text>
                                </TouchableOpacity>
                            </View>
                            {showEndTimePicker && (
                                <View style={styles.timePickerContainer}>
                                    <DateTimePicker
                                        value={endTime}
                                        mode="time"
                                        is24Hour={false}
                                        display={
                                            Platform.OS === "ios"
                                                ? "spinner"
                                                : "default"
                                        }
                                        onChange={(event, date) => {
                                            setShowEndTimePicker(false);
                                            onTimeChange(event, date, "end");
                                        }}
                                        style={styles.timePicker}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Meal Items</Text>
                    {mealItems.map((item: any, index: number) => {
                        // Check if this item is selected
                        const isSelected = selectedMealItems.includes(
                            item.name
                        );

                        return (
                            <View key={index} style={styles.mealItemRow}>
                                <Text style={styles.mealItemText}>
                                    {item.name}
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.addButton,
                                        isSelected && styles.selectedAddButton,
                                    ]}
                                    onPress={() =>
                                        handleAddMealItem(item._id, item.name)
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.addButtonText,
                                            isSelected &&
                                                styles.selectedAddButtonText,
                                        ]}
                                    >
                                        {isSelected ? "ADDED" : "ADD"}
                                    </Text>
                                    <Ionicons
                                        name={isSelected ? "checkmark" : "add"}
                                        size={16}
                                        color={isSelected ? "#fff" : "#FFA500"}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={styles.imagePreviewContainer}
                    onPress={async () => {
                        const result =
                            await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                aspect: [4, 3],
                                quality: 1,
                            });

                        if (!result.canceled) {
                            setMealImage(
                                result.assets[0].uri as unknown as null
                            );
                        }
                    }}
                >
                    {mealImage ? (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: mealImage }}
                                style={styles.mealImage}
                            />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    setMealImage(null);
                                }}
                            >
                                <Ionicons name="close" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.uploadImageContainer}>
                            <Ionicons name="camera" size={40} color="#ccc" />
                            <Text style={styles.uploadImageText}>
                                Tap to upload meal image
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
                style={[
                    styles.addMealButton,
                    createMealMutation.isPending && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={createMealMutation.isPending}
            >
                <Text style={styles.addMealButtonText}>
                    {createMealMutation.isPending ? "CREATING..." : "ADD MEAL"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddMeal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: "#fff",
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FFA500",
    },
    formContainer: {
        flex: 1,
        padding: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
    },
    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    dropdownModal: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 10,
        maxHeight: 300,
    },
    dropdownScroll: {
        width: "100%",
        maxHeight: 280,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    dropdownItemText: {
        fontSize: 16,
    },
    selectedDropdownItem: {
        color: "#FFA500",
        fontWeight: "bold",
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    timeGroup: {
        width: "48%",
    },
    timeLabel: {
        marginBottom: 8,
    },
    timeInputContainer: {
        flexDirection: "row",
    },
    timeInput: {
        flex: 2,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginRight: 5,
    },
    amPmSelector: {
        flex: 1,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    mealItemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    mealItemText: {
        fontSize: 16,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF5E6",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    addButtonText: {
        color: "#FFA500",
        marginRight: 4,
        fontSize: 12,
        fontWeight: "bold",
    },
    imagePreviewContainer: {
        height: 150,
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        overflow: "hidden",
    },
    imageContainer: {
        width: "100%",
        height: "100%",
        position: "relative",
    },
    mealImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    removeImageButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#fff",
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    addMealButton: {
        backgroundColor: "#FFA500",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        margin: 16,
    },
    addMealButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    timePickerContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    timePicker: {
        width: Platform.OS === "ios" ? "100%" : "auto",
    },
    selectedAddButton: {
        backgroundColor: "#FFA500",
    },
    selectedAddButtonText: {
        color: "#fff",
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },

    uploadImageContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    uploadImageText: {
        marginTop: 10,
        color: "#888",
        fontSize: 14,
    },
});
