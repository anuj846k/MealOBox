import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Switch,
    Image,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAllDeliveryPartners } from "../api/getApi/getApi";
import { togglePartnerStatus } from "../api/updateApi/updateApi";

interface Partner {
    _id: string;
    name: string;
    phone: string;
    email: string;
    isActive: boolean;
    assignedSlots: string[];
    paymentDetails?: {
        beneficiaryName: string;
        ifscCode: string;
        bankName: string;
    };
    paymentSystem?: {
        deliveryCharges: number;
        onTimeDeliveryBonus: number;
        highRatingBonus: number;
    };
    workingDays?: {
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
        sunday: boolean;
    };
    kitchenPartnerId?: {
        kitchenName: string;
        address: string;
    };
}

const PartnerDetails = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [partner, setPartner] = useState<Partner | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchPartnerDetails();
    }, [id]);

    const fetchPartnerDetails = async () => {
        try {
            setLoading(true);
            const response = await getAllDeliveryPartners();
            if (response.success) {
                const foundPartner = response.data.find(
                    (p: Partner) => String(p._id) === String(id)
                );
                if (foundPartner) {
                    setPartner(foundPartner);
                } else {
                    setError("Partner not found");
                }
            } else {
                setError("Failed to fetch partner details");
            }
        } catch (err) {
            setError("An error occurred while fetching partner details");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (value: boolean) => {
        if (!partner) return;

        try {
            setUpdatingStatus(true);
            const response = await togglePartnerStatus(partner._id);

            if (response && response.success) {
                // Update local state
                setPartner({ ...partner, isActive: value });
                
                // Show success message
                Alert.alert(
                    "Success",
                    `Partner status updated to ${value ? "Active" : "Inactive"}`
                );

                // Refresh the data
                await fetchPartnerDetails();
            } else {
                Alert.alert(
                    "Error",
                    response?.message || "Failed to update partner status"
                );
                // Revert the switch to previous state
                setPartner({ ...partner, isActive: !value });
            }
        } catch (err) {
            console.error("Status toggle error:", err);
            Alert.alert(
                "Error",
                "An error occurred while updating status. Please try again."
            );
            // Revert the switch to previous state
            setPartner({ ...partner, isActive: !value });
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFA500" />
                </View>
            </SafeAreaView>
        );
    }

    if (error || !partner) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {error || "Partner not found"}
                    </Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={fetchPartnerDetails}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
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
                <Text style={styles.headerTitle}>Delivery Partner Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Name</Text>
                    <Text style={styles.fieldValue}>
                        {partner.name || "Not available"}
                    </Text>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Phone</Text>
                    <Text style={styles.fieldValue}>
                        {partner.phone || "Not available"}
                    </Text>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <Text style={styles.fieldValue}>
                        {partner.email || "Not available"}
                    </Text>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Status</Text>
                    <View style={styles.statusContainer}>
                        <Text style={styles.fieldValue}>
                            {partner.isActive ? "Active" : "Inactive"}
                        </Text>
                        <Switch
                            value={partner.isActive}
                            onValueChange={handleStatusToggle}
                            trackColor={{ false: "#767577", true: "#FFA500" }}
                            thumbColor={
                                partner.isActive ? "#FFFFFF" : "#FFFFFF"
                            }
                            disabled={updatingStatus}
                        />
                        {updatingStatus && (
                            <ActivityIndicator
                                size="small"
                                color="#FFA500"
                                style={styles.statusLoading}
                            />
                        )}
                    </View>
                </View>

                {partner.paymentDetails && (
                    <>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Bank Name</Text>
                            <Text style={styles.fieldValue}>
                                {partner.paymentDetails.bankName ||
                                    "Not available"}
                            </Text>
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>IFSC Code</Text>
                            <Text style={styles.fieldValue}>
                                {partner.paymentDetails.ifscCode ||
                                    "Not available"}
                            </Text>
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>
                                Beneficiary Name
                            </Text>
                            <Text style={styles.fieldValue}>
                                {partner.paymentDetails.beneficiaryName ||
                                    "Not available"}
                            </Text>
                        </View>
                    </>
                )}

                {partner.paymentSystem && (
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Delivery Charges</Text>
                        <Text style={styles.fieldValue}>
                            ₹{partner.paymentSystem.deliveryCharges || "0"}
                        </Text>
                    </View>
                )}

                {partner.kitchenPartnerId && (
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>
                            Associated Kitchen
                        </Text>
                        <Text style={styles.fieldValue}>
                            {partner.kitchenPartnerId.kitchenName ||
                                "Not available"}
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                        router.push(`/(screens)/EditPartner?id=${partner._id}`)
                    }
                >
                    <Text style={styles.editButtonText}>EDIT DETAILS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>DELETE</Text>
                </TouchableOpacity>
            </View>
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
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "#FF0000",
        marginBottom: 20,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#FFA500",
        padding: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
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
    fieldContainer: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 14,
        color: "#888888",
        marginBottom: 4,
    },
    fieldValue: {
        fontSize: 16,
        color: "#000000",
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    buttonContainer: {
        flexDirection: "row",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },
    editButton: {
        flex: 1,
        backgroundColor: "#FFA500",
        padding: 12,
        borderRadius: 4,
        alignItems: "center",
        marginRight: 8,
    },
    editButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    deleteButton: {
        flex: 1,
        backgroundColor: "#FF5252",
        padding: 12,
        borderRadius: 4,
        alignItems: "center",
        marginLeft: 8,
    },
    deleteButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    statusLoading: {
        marginLeft: 8,
    },
});

export default PartnerDetails;
