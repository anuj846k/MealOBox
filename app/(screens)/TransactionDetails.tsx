import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TransactionDetails = () => {
    const router = useRouter();

    // Mock transaction details
    const transactionDetails = {
        serialNumber: "1",
        fromDate: "22 February, 2025",
        toDate: "28 February, 2025",
        totalDeliveries: "50",
        totalEarnings: "₹7500",
        mobCommission: "-₹1500",
        payout: "₹6000",
        status: "Paid",
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
                <Text style={styles.headerTitle}>Transaction Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>S. No.</Text>
                        <Text style={styles.detailValue}>{transactionDetails.serialNumber}</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>From Date</Text>
                        <Text style={styles.detailValue}>{transactionDetails.fromDate}</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>To Date</Text>
                        <Text style={styles.detailValue}>{transactionDetails.toDate}</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Total Deliveries</Text>
                        <Text style={styles.detailValue}>{transactionDetails.totalDeliveries}</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Total Earnings</Text>
                        <Text style={styles.detailValue}>{transactionDetails.totalEarnings}</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>MOB Commission</Text>
                        <Text style={[styles.detailValue, styles.negativeValue]}>
                            {transactionDetails.mobCommission}
                        </Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Payout</Text>
                        <Text style={[styles.detailValue, styles.boldValue]}>
                            {transactionDetails.payout}
                        </Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{transactionDetails.status}</Text>
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
    },
    detailsContainer: {
        padding: 16,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
    },
    detailLabel: {
        fontSize: 16,
        color: "#333",
    },
    detailValue: {
        fontSize: 16,
        color: "#000",
        textAlign: "right",
    },
    boldValue: {
        fontWeight: "bold",
    },
    negativeValue: {
        color: "#E53935",
    },
    separator: {
        height: 1,
        backgroundColor: "#F0F0F0",
    },
    statusBadge: {
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    statusText: {
        color: "#4CAF50",
        fontSize: 14,
        fontWeight: "500",
    },
});

export default TransactionDetails;