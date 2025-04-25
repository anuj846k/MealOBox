import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { fetchSlotDetails } from "../api/getApi/getApi";

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface DeliveryLocation {
    coordinates: Coordinates;
    address: string;
    area: string;
    distance: string;
}

interface CustomerAddress {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
}

interface Customer {
    _id: string;
    name: string;
    phone: string;
    address?: CustomerAddress;
}

interface Meal {
    _id: string;
    name: string;
    type: string;
}

interface Slot {
    _id: string;
    mealType: string;
    startTime: string;
    endTime: string;
}

interface Order {
    deliveryLocation: DeliveryLocation;
    _id: string;
    orderNumber: string;
    customer: Customer;
    meal: Meal;
    kitchenPartner: string;
    deliveryPartner: string | null;
    status: string;
    totalAmount: number;
    paymentStatus: string;
    slot: Slot;
    deliveryDate: string;
    deliveryTime: string;
    specialInstructions: string;
    createdAt: string;
    updatedAt: string;
}

interface AreaOrders {
    area: string;
    totalOrders: number;
    orders: Order[];
    coordinates: Coordinates;
}

interface ApiResponse {
    success: boolean;
    totalOrders: number;
    ordersByArea: AreaOrders[];
}

const CustomerDetails = () => {
    const router = useRouter();
    const { id, slotId } = useLocalSearchParams();

    const { data, isLoading, error } = useQuery({
        queryKey: ["customerDetails", slotId],
        queryFn: () => fetchSlotDetails(slotId as string),
    });

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFC107" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    Error loading customer details
                </Text>
            </View>
        );
    }

    // Find the order with the matching ID
    const order = data?.ordersByArea
        .flatMap((area: AreaOrders) => area.orders)
        .find((order: Order) => order._id === id);

    if (!order) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Customer not found</Text>
            </View>
        );
    }

    // Format the date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color="#FFC107" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Customer Details</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Customer Basic Info */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>User</Text>
                    <Text style={styles.fieldValue}>
                        {order.customer?.name || "N/A"}
                    </Text>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Phone</Text>
                    <Text style={styles.fieldValue}>
                        {order.customer?.phone || "N/A"}
                    </Text>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Address</Text>
                    <Text style={styles.fieldValue}>
                        {order.deliveryLocation.address}
                    </Text>
                </View>

                <View style={styles.fieldContainer}>
                    {/* TODO: Add plan name */}
                    <Text style={styles.fieldLabel}>Plan Name</Text>
                    <Text style={styles.fieldValue}>Monthly Plan</Text>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Total Amount</Text>
                    <Text style={styles.fieldValue}>₹{order.totalAmount}</Text>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Starting Date</Text>
                    <Text style={styles.fieldValue}>
                        {formatDate(order.deliveryDate)}
                    </Text>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Valid Till</Text>
                    <Text style={styles.fieldValue}>
                        {formatDate(order.deliveryDate)}
                    </Text>
                </View>

                {/* Subscription Details */}
                <View style={styles.subscriptionContainer}>
                    <Text style={styles.subscriptionTitle}>ORDER DETAILS</Text>

                    <View style={styles.subscriptionBlock}>
                        <View style={styles.typeContainer}>
                            <Text style={styles.fieldLabel}>Order Number</Text>
                            <Text style={styles.fieldValue}>
                                {order?.orderNumber}
                            </Text>
                        </View>

                        <View style={styles.typeContainer}>
                            <Text style={styles.fieldLabel}>Item Name</Text>
                            <Text style={styles.fieldValue}>
                                {order?.meal?.name}
                            </Text>
                        </View>
                        <View style={styles.typeContainer}>
                            <Text style={styles.fieldLabel}>Type</Text>
                            <Text style={styles.fieldValue}>
                                {order?.meal?.type}
                            </Text>
                        </View>

                        <View style={styles.mealsContainer}>
                            <Text style={styles.fieldLabel}>Delivery Time</Text>
                            <Text style={styles.fieldValue}>
                                {order.deliveryTime}
                            </Text>
                        </View>

                        <View style={styles.mealsContainer}>
                            <Text style={styles.fieldLabel}>
                                Special Instructions
                            </Text>
                            <Text style={styles.fieldValue}>
                                {order.specialInstructions}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    errorText: {
        color: "#FF5252",
        fontSize: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 8,
        color: "#FFC107",
    },
    content: {
        flex: 1,
        padding: 16,
    },
    fieldContainer: {
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    fieldLabel: {
        fontSize: 14,
        color: "#666666",
        marginBottom: 4,
    },
    fieldValue: {
        fontSize: 16,
        color: "#000000",
    },
    subscriptionContainer: {
        marginTop: 16,
    },
    subscriptionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 16,
    },
    subscriptionBlock: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#EEEEEE",
    },
    typeContainer: {
        marginBottom: 16,
    },
    mealsContainer: {
        marginBottom: 16,
    },
});

export default CustomerDetails;
