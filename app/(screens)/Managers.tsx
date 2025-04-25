import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Image,
    ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getManagers } from "../api/getApi/getApi";
import { useQuery } from "@tanstack/react-query";

interface Manager {
    _id: string;
    name: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    branch: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ManagersResponse {
    statusCode: number;
    data: string;
    message: Manager[];
    success: boolean;
}

const Managers = () => {
    const router = useRouter();
    
    const { data: managersData, isLoading, error } = useQuery<ManagersResponse>({
        queryKey: ["managers"],
        queryFn: getManagers
    });

    const managers = managersData?.message || [];

    const renderManagerItem = ({ item }: { item: Manager }) => (
        <TouchableOpacity
            style={styles.managerItem}
            onPress={() =>
                router.push(`/(screens)/ManagerDetails?id=${item._id}`)
            }
        >
            <Image 
                source={require("../../assets/images/chef.png")} 
                style={styles.managerAvatar} 
            />
            <View style={styles.managerInfo}>
                <Text style={styles.managerName}>{item.name}</Text>
                <Text style={styles.managerRole}>
                    {item.branch}
                </Text>
                <Text style={styles.managerContact}>
                    {item.phone} • {item.email}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Managers</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFA500" />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Managers</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error loading managers</Text>
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
                <Text style={styles.headerTitle}>Managers</Text>
                <View style={{ width: 24 }} />
            </View>

            {managers.length > 0 ? (
                <FlatList
                    data={managers}
                    renderItem={renderManagerItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.managerList}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No managers found</Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/(screens)/AddManagers")}
            >
                <Text style={styles.addButtonText}>ADD MANAGER</Text>
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
    managerList: {
        padding: 16,
    },
    managerItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    managerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    managerInfo: {
        flex: 1,
    },
    managerName: {
        fontSize: 16,
        fontWeight: "500",
    },
    managerRole: {
        fontSize: 12,
        color: "#888888",
        marginTop: 2,
    },
    managerContact: {
        fontSize: 12,
        color: "#888888",
        marginTop: 2,
    },
    addButton: {
        backgroundColor: "#FFA500",
        padding: 16,
        margin: 16,
        borderRadius: 4,
        alignItems: "center",
    },
    addButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
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
    },
    errorText: {
        fontSize: 16,
        color: "#FF5252",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#888888",
    },
});

export default Managers;
