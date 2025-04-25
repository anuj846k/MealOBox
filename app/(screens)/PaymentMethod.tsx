import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PaymentMethod = () => {
    const router = useRouter();

    // Mock payment method details
    const paymentMethod = {
        title: "Axis Bank Debit Card",
        accountNumber: "1200249797430",
        accountHolderName: "Amar Nath",
        ifscCode: "KXBK1002",
    };

    const handleUpdate = () => {
        Alert.alert("Update Payment Method", "Would you like to update your payment details?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Update",
                onPress: () => Alert.alert("Success", "Payment method updated successfully"),
            },
        ]);
    };

    const handleDelete = () => {
        Alert.alert("Delete Payment Method", "Are you sure you want to delete this payment method?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    Alert.alert("Success", "Payment method deleted successfully");
                    router.back();
                },
            },
        ]);
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
                <Text style={styles.headerTitle}>Payment Method</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.cardContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Title</Text>
                        <Text style={styles.detailValue}>{paymentMethod.title}</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Account Number</Text>
                        <Text style={styles.detailValue}>{paymentMethod.accountNumber}</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Account Holder Name</Text>
                        <Text style={styles.detailValue}>{paymentMethod.accountHolderName}</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>IFSC Code</Text>
                        <Text style={styles.detailValue}>{paymentMethod.ifscCode}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleUpdate}
                    >
                        <Text style={styles.updateButtonText}>UPDATE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                    >
                        <Text style={styles.deleteButtonText}>DELETE</Text>
                    </TouchableOpacity>
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
        padding: 16,
    },
    cardContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 24,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    detailLabel: {
        fontSize: 16,
        color: "#666",
    },
   // Continuing styles for PaymentMethod.tsx
   detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    textAlign: "right",
},
separator: {
    height: 1,
    backgroundColor: "#F0F0F0",
},
buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
},
updateButton: {
    flex: 1,
    backgroundColor: "#FFA500",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginRight: 8,
},
updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
},
deleteButton: {
    flex: 1,
    backgroundColor: "#E74C3C",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginLeft: 8,
},
deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
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

export default PaymentMethod;