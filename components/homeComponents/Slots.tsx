import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchMyMeals } from "@/app/api/getApi/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    const time = date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return { day, month, year, time };
};

interface SlotItem {
    id: number;
    slot: string;
    time: string;
    tiffins: string;
    partner: string;
}

interface SlotsProps {
    isOpen: boolean;
}

const Slots = ({ isOpen }: SlotsProps) => {
    const [selectedMeal, setSelectedMeal] = useState("Breakfast");
    const [kitchenPartnerId, setKitchenPartnerId] = useState<string>("");

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

    const { data, isLoading } = useQuery({
        queryKey: ["slots"],
        queryFn: () => fetchMyMeals(kitchenPartnerId),
        enabled: !!kitchenPartnerId && isOpen,
    });

    const availableSlots = data?.data || [];

    // Filter slots based on selected meal type
    const filteredSlots = availableSlots.filter(
        (slot: { mealType?: string }) =>
            slot.mealType?.toLowerCase() === selectedMeal.toLowerCase()
    );

    // Format time to hh:mm am/pm
    const formatTime = (timeString: string) => {
        if (!timeString) return "";

        try {
            // Parse the time string (assuming it's in ISO format or similar)
            const date = new Date(timeString);
            return date.toLocaleString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } catch (error) {
            console.error("Error formatting time:", error);
            return timeString; // Return original if parsing fails
        }
    };

    // Use filteredSlots instead of hardcoded slots
    const renderSlot = ({ item, index }: { item: any; index: number }) => (
        <Link
            href={`/(screens)/slotDetails?id=${item._id || ""}`}
            asChild
            onPress={() => {
                console.log("Clicked Slot Id:", item._id);
                console.log("Full Slot data:", item);
            }}
        >
            <TouchableOpacity style={styles.slotContainer}>
                <View style={styles.slotLeftContent}>
                    <View style={styles.clockIconContainer}>
                        <Ionicons
                            name="time-outline"
                            size={20}
                            color="#FFC107"
                        />
                    </View>
                    <View style={styles.slotInfo}>
                        <Text style={styles.slotTitle}>
                            SLOT {index + 1} ({formatTime(item.startTime)} -{" "}
                            {formatTime(item.endTime)})
                        </Text>
                        <Text style={styles.slotSubtitle}>
                            Total Tiffins: {item.tiffins || "0"} | Delivery
                            Partner:{" "}
                            {item.deliveryPartner?.name || "Not assigned"}{" | "}
                            {item.deliveryPartner?.isActive? "Active" : "Inactive"}
                        </Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>
        </Link>
    );

    const { day, month, year, time } = getCurrentDate();
    return (
        <View style={[styles.container, !isOpen && styles.containerClosed]}>
            <View style={styles.timeAndDateContainer}>
                <Text style={[styles.Text, !isOpen && styles.textClosed]}>
                    {day} {month}, {year}
                </Text>

                <Text style={(styles.Text, !isOpen && styles.textClosed)}>
                    {time}
                </Text>
            </View>

            <View
                style={[
                    styles.mealTypeContainer,
                    !isOpen && styles.mealTypeContainerClosed,
                ]}
            >
                {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                    <TouchableOpacity
                        key={meal}
                        style={[
                            styles.mealTypeButton,
                            selectedMeal === meal && styles.selectedMealType,
                            !isOpen && styles.mealTypeButtonClosed,
                        ]}
                        onPress={() => setSelectedMeal(meal)}
                        disabled={!isOpen}
                    >
                        <Text
                            style={[
                                styles.mealTypeText,
                                selectedMeal === meal &&
                                    styles.selectedMealTypeText,
                                !isOpen && styles.mealTypeTextClosed,
                            ]}
                        >
                            {meal}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Slots */}
            <FlatList
                data={isOpen ? filteredSlots : []}
                renderItem={renderSlot}
                keyExtractor={(item) =>
                    item._id?.toString() || Math.random().toString()
                }
                contentContainerStyle={styles.slotsList}
                nestedScrollEnabled={true}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text
                            style={[
                                styles.emptyText,
                                !isOpen && styles.textClosed,
                            ]}
                        >
                            {isOpen
                                ? `No slots available for ${selectedMeal}`
                                : "Kitchen is currently closed"}
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

export default Slots;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    timeAndDateContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },

    Text: {
        fontFamily: "nunito-b",
        fontSize: 16,
    },

    slotContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF9E6",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#FFE082",
    },

    slotLeftContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    clockIconContainer: {
        marginRight: 12,
    },

    slotInfo: {
        flex: 1,
    },

    slotTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333333",
    },

    slotSubtitle: {
        fontSize: 12,
        color: "#666666",
        marginTop: 2,
    },

    slotsList: {
        paddingBottom: 16,
    },

    mealTypeContainer: {
        flexDirection: "row",
        backgroundColor: "#FFC107",
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 16,
        marginTop: 10,
    },
    mealTypeButton: {
        flex: 1,
        padding: 12,
        alignItems: "center",
    },

    selectedMealType: {
        backgroundColor: "#F57C00",
    },
    mealTypeText: {
        color: "#FFFFFF",
        fontWeight: "500",
    },
    selectedMealTypeText: {
        fontWeight: "bold",
    },
    emptyContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        fontFamily: "nunito-b",
        fontSize: 14,
        color: "#666666",
    },
    containerClosed: {
        opacity: 0.7,
    },
    textClosed: {
        color: "#666666",
    },
    mealTypeContainerClosed: {
        backgroundColor: "#CCCCCC",
    },
    mealTypeButtonClosed: {
        backgroundColor: "#CCCCCC",
    },
    mealTypeTextClosed: {
        color: "#666666",
    },
    slotContainerClosed: {
        backgroundColor: "#F5F5F5",
        borderColor: "#CCCCCC",
    },
});
