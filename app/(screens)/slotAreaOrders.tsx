import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchSlotDetails } from "../api/getApi/getApi";

type DeliveryStatus = "Preparing" | "Delivered" | "Failed";

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
    customer: {
        name: string;
        phone: string;
        address: string;
    };
    meal: string;
    kitchenPartner: string;
    deliveryPartner: null | string;
    status: DeliveryStatus;
    totalAmount: number;
    paymentStatus: string;
    slot: Slot;
    deliveryDate: string;
    deliveryTime: string;
    specialInstructions: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
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

export default function SlotAreaOrdersScreen() {
    const params = useLocalSearchParams();
    const { slotId, area } = params;

    const { data, isLoading, error } = useQuery<ApiResponse>({
        queryKey: ["slotAreaOrders", slotId, area],
        queryFn: () => fetchSlotDetails(slotId as string),
        enabled: !!slotId,
    });

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error loading orders</Text>
            </View>
        );
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Delivered":
                return styles.statusGreen;
            case "Failed":
                return styles.statusRed;
            default:
                return styles.statusYellow;
        }
    };

    const renderCustomerItem = ({ item }: { item: Order }) => (
        <TouchableOpacity
            style={styles.customerItem}
            onPress={() =>
                router.push({
                    pathname: "/(screens)/CustomerDetails",
                    params: { id: item._id, slotId },
                })
            }
        >
            <View style={styles.mainContent}>
                <View style={styles.orderRow}>
                    <Text style={[styles.itemText, styles.customerName]}>
                        {item.customer?.name || "N/A"}
                    </Text>

                    <Text style={[styles.itemText, styles.distanceText]}>
                        {item.deliveryLocation.distance} m
                    </Text>
                    <Text style={[styles.itemText, styles.mealTypeText]}>
                        1
                    </Text>
                </View>
                <View style={styles.statusContainer}>
                    <View
                        style={[
                            styles.statusBadge,
                            getStatusStyle(item.status),
                        ]}
                    >
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
            </View>
            <Ionicons
                name="chevron-forward"
                size={24}
                color="#CCCCCC"
                onPress={() =>
                    router.push({
                        pathname: "/(screens)/CustomerDetails",
                        params: { id: item._id, slotId },
                    })
                }
            />
        </TouchableOpacity>
    );

    // Find the current area's orders
    const currentAreaOrders = data?.ordersByArea.find(
        (areaData) => areaData.area === area
    );

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
                <Text style={styles.headerTitle}>Area Details</Text>
            </View>

            {/* Area Info */}
            <View style={styles.areaInfoContainer}>
                <View style={styles.areaInfo}>
                    <Text style={styles.areaLabel}>AREA:</Text>
                    <Text style={styles.areaName}>
                        {currentAreaOrders?.area}
                    </Text>
                </View>
                <View style={styles.totalDeliveries}>
                    <Text style={styles.totalDeliveriesLabel}>
                        TOTAL DELIVERIES:
                    </Text>
                    <Text style={styles.totalDeliveriesValue}>
                        {currentAreaOrders?.totalOrders || 0}
                    </Text>
                </View>
            </View>

            {/* Column Headers */}
            <View style={styles.columnHeaders}>
                <Text style={[styles.columnHeader, styles.customerNameHeader]}>
                    Customer Name
                </Text>
                <Text style={[styles.columnHeader, styles.distanceHeader]}>
                    Distance
                </Text>
                <Text style={[styles.columnHeader, styles.mealTypeHeader]}>
                    {/* Meal Type */}
                    No. of Meals
                </Text>
            </View>

            <View style={styles.divider} />

            <FlatList
                data={currentAreaOrders?.orders || []}
                renderItem={renderCustomerItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
            />
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
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
    areaInfoContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFF9E6",
    },
    areaInfo: {
        marginBottom: 8,
    },
    areaLabel: {
        fontSize: 12,
        color: "#666666",
        marginBottom: 4,
    },
    areaName: {
        fontSize: 24,
        fontWeight: "600",
        color: "#333333",
    },
    totalDeliveries: {
        flexDirection: "row",
        alignItems: "center",
    },
    totalDeliveriesLabel: {
        fontSize: 14,
        color: "#666666",
        marginRight: 8,
    },
    totalDeliveriesValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333333",
    },
    columnHeaders: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#FFE082",
    },
    columnHeader: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333333",
    },
    customerNameHeader: {
        flex: 3,
    },
    distanceHeader: {
        flex: 2,
        textAlign: "center",
    },
    mealTypeHeader: {
        flex: 2,
        textAlign: "right",
    },
    divider: {
        height: 1,
        backgroundColor: "#FFE082",
        marginHorizontal: 16,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    customerItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    mainContent: {
        flex: 1,
    },
    orderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    itemText: {
        fontSize: 14,
        color: "#333333",
    },
    customerName: {
        flex: 3,
        fontWeight: "500",
    },
    distanceText: {
        flex: 2,
        textAlign: "center",
        color: "#666666",
    },
    mealTypeText: {
        flex: 2,
        textAlign: "right",
        color: "#666666",
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: "#FFF3E0",
        alignSelf: "flex-start",
    },
    statusGreen: {
        backgroundColor: "#E8F5E9",
    },
    statusYellow: {
        backgroundColor: "#FFF3E0",
    },
    statusRed: {
        backgroundColor: "#FFEBEE",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#333333",
    },
});
