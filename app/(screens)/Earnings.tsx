import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Switch,
    FlatList,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const transactions = [
    {
        id: "1",
        period: "1 Jan 2025 - 7 Jan 2025",
        receivedDate: "8 January 2025",
        amount: "₹2000",
        checked: true,
    },
    {
        id: "2",
        period: "8 Jan 2025 - 15 Jan 2025",
        receivedDate: "17 January 2025",
        amount: "₹5500",
        checked: false,
    },
    {
        id: "3",
        period: "16 Jan 2025 - 23 Jan 2025",
        receivedDate: "25 January 2025",
        amount: "₹6000",
        checked: true,
    },
    {
        id: "4",
        period: "24 Jan 2025 - 31 Jan 2025",
        receivedDate: "2 February 2025",
        amount: "₹5000",
        checked: false,
    },
];

const Earnings = () => {
    const router = useRouter();
    const [autoPayoutEnabled, setAutoPayoutEnabled] = useState(true);

    const toggleAutoPayout = () => {
        setAutoPayoutEnabled(!autoPayoutEnabled);
    };

    const renderTransactionItem = ({
        item,
        index,
    }: {
        item: any;
        index: number;
    }) => (
        <View style={styles.transactionItem}>
            <View style={styles.transactionItemLeft}>
                <Ionicons name="wallet-outline" size={24} color="#FFA500" />
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionPeriod}>{item.period}</Text>
                    <Text style={styles.transactionDate}>
                        Received On: {item.receivedDate}
                    </Text>
                </View>
            </View>
            <View style={styles.transactionItemRight}>
                <Text style={styles.transactionAmount}>{item.amount}</Text>
                {item.checked && (
                    <Ionicons name="checkmark" size={18} color="#4CAF50" />
                )}
            </View>
            <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => router.push("/(screens)/TransactionDetails")}
            >
                <Text style={styles.viewDetailsText}>
                    VIEW TRANSACTION DETAILS
                </Text>
            </TouchableOpacity>
        </View>
    );

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
                <Text style={styles.headerTitle}>My Earnings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.earningsSummary}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Earnings</Text>
                        <Text style={styles.summaryValue}>₹65000</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>This Month</Text>
                        <Text style={styles.summaryValue}>₹5000</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Last Month</Text>
                        <Text style={styles.summaryValue}>₹60000</Text>
                    </View>
                </View>

                <View style={styles.autoPayoutCard}>
                    <View style={styles.autoPayoutRow}>
                        <View style={styles.autoPayoutInfo}>
                            <Ionicons name="repeat" size={24} color="#FFA500" />
                            <View style={styles.autoPayoutTexts}>
                                <Text style={styles.autoPayoutTitle}>
                                    Enable Auto Payout Weekly!
                                </Text>
                                <Text style={styles.autoPayoutDesc}>
                                    Automatically transfer my weekly earnings to
                                    my linked bank account.
                                </Text>
                            </View>
                        </View>
                        <Switch
                            trackColor={{ false: "#E0E0E0", true: "#FFD180" }}
                            thumbColor={
                                autoPayoutEnabled ? "#FFA500" : "#F4F3F4"
                            }
                            onValueChange={toggleAutoPayout}
                            value={autoPayoutEnabled}
                        />
                    </View>
                </View>

                <View style={styles.transactionsHeader}>
                    <Text style={styles.transactionsTitle}>
                        All Transactions
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/(screens)/AllTransactions")
                        }
                    >
                        <Text style={styles.seeAllText}>
                            see all{" "}
                            <Ionicons
                                name="chevron-forward"
                                size={12}
                                color="#FFA500"
                            />
                        </Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <FlatList
                        data={transactions}
                        renderItem={renderTransactionItem}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        nestedScrollEnabled={true}
                    />
                </View>
            </ScrollView>

            <View style={styles.tabBar}>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="home-outline" size={24} color="#888" />
                    <Text style={styles.tabLabel}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="person-outline" size={24} color="#888" />
                    <Text style={styles.tabLabel}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="menu-outline" size={24} color="#888" />
                    <Text style={styles.tabLabel}>Menu</Text>
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
    earningsSummary: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F5",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: "#666",
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000",
    },
    autoPayoutCard: {
        margin: 16,
        padding: 16,
        backgroundColor: "#FFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    autoPayoutRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    autoPayoutInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    autoPayoutTexts: {
        marginLeft: 12,
        flex: 1,
    },
    autoPayoutTitle: {
        fontSize: 14,
        fontWeight: "500",
    },
    autoPayoutDesc: {
        fontSize: 12,
        color: "#888",
        marginTop: 2,
    },
    transactionsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    transactionsTitle: {
        fontSize: 16,
        fontWeight: "500",
    },
    seeAllText: {
        fontSize: 14,
        color: "#FFA500",
    },
    transactionItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F5",
    },
    transactionItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    transactionDetails: {
        marginLeft: 12,
    },
    transactionPeriod: {
        fontSize: 14,
        fontWeight: "500",
    },
    transactionDate: {
        fontSize: 12,
        color: "#888",
        marginTop: 2,
    },
    transactionItemRight: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 4,
    },
    viewDetailsButton: {
        backgroundColor: "#FFA500",
        borderRadius: 4,
        padding: 8,
        alignItems: "center",
        marginTop: 8,
    },
    viewDetailsText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "500",
    },
    tabBar: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
        backgroundColor: "#FFFFFF",
        paddingVertical: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    tabLabel: {
        fontSize: 12,
        color: "#888",
        marginTop: 4,
    },
});

export default Earnings;
