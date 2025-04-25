import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    TextInput,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const allTransactions = [
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
    {
        id: "5",
        period: "24 Jan 2025 - 31 Jan 2025",
        receivedDate: "2 February 2025",
        amount: "₹5000",
        checked: true,
    },
];

const AllTransactions = () => {
    const router = useRouter();
    const [fromDate, setFromDate] = useState("1 January, 2025");
    const [toDate, setToDate] = useState("31 January, 2025");

    const renderTransactionItem = ({ item }: { item: any }) => (
        <View style={styles.transactionItem}>
            <View style={styles.transactionHeader}>
                <View style={styles.transactionIcon}>
                    <Ionicons name="wallet-outline" size={24} color="#FFA500" />
                </View>
                <View style={styles.transactionInfo}>
                    <Text style={styles.transactionPeriod}>{item.period}</Text>
                    <Text style={styles.transactionDate}>Received On: {item.receivedDate}</Text>
                </View>
                <View style={styles.transactionAmount}>
                    <Text style={styles.amountText}>{item.amount}</Text>
                    {item.checked && <Ionicons name="checkmark" size={18} color="#4CAF50" />}
                </View>
            </View>
            <TouchableOpacity 
                style={styles.viewDetailsButton}
                onPress={() => router.push("/(screens)/TransactionDetails")}
            >
                <Text style={styles.viewDetailsText}>VIEW TRANSACTION DETAILS</Text>
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
                <Text style={styles.headerTitle}>All Transactions</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.dateFilter}>
                <View style={styles.dateInputContainer}>
                    <Text style={styles.dateLabel}>From Date:</Text>
                    <TouchableOpacity style={styles.dateInput}>
                        <Text>{fromDate}</Text>
                        <Ionicons name="calendar-outline" size={18} color="#888" />
                    </TouchableOpacity>
                </View>

                <View style={styles.dateInputContainer}>
                    <Text style={styles.dateLabel}>To Date:</Text>
                    <TouchableOpacity style={styles.dateInput}>
                        <Text>{toDate}</Text>
                        <Ionicons name="calendar-outline" size={18} color="#888" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Transactions</Text>

            <FlatList
                data={allTransactions}
                renderItem={renderTransactionItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />

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
    dateFilter: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F5",
    },
    dateInputContainer: {
        marginBottom: 12,
    },
    dateLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    dateInput: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 4,
        padding: 8,
        backgroundColor: "#FFF",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "500",
        padding: 16,
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    transactionItem: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        borderRadius: 8,
        overflow: "hidden",
    },
    transactionHeader: {
        flexDirection: "row",
        padding: 12,
        alignItems: "center",
        backgroundColor: "#FAFAFA",
    },
    transactionIcon: {
        marginRight: 12,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionPeriod: {
        fontSize: 14,
        fontWeight: "500",
    },
    transactionDate: {
        fontSize: 12,
        color: "#888",
    },
    transactionAmount: {
        flexDirection: "row",
        alignItems: "center",
    },
    amountText: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 4,
    },
    viewDetailsButton: {
        backgroundColor: "#FFA500",
        padding: 10,
        alignItems: "center",
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

export default AllTransactions;