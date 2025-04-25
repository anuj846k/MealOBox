import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getManagerById } from "../api/getApi/getApi";
import { deleteManager } from "../api/updateApi/updateApi";

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

const ManagerDetails = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["manager", id],
        queryFn: () => getManagerById(id as string),
        enabled: !!id,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteManager,
        onSuccess: () => {
            // Invalidate managers list to trigger a refresh
            queryClient.invalidateQueries({ queryKey: ["managers"] });
            Alert.alert("Success", "Manager deleted successfully");
            router.back();
        },
        onError: (error: any) => {
            Alert.alert("Error", error.message || "Failed to delete manager");
        },
    });

    const manager: Manager | undefined = data?.message;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (error) {
            return "Invalid date";
        }
    };

    const handleEdit = () => {
        router.push(`/EditManager?id=${id}`);
    };

    const handleDelete = () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this manager?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteMutation.mutate(id as string);
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={24} color="#FFA500" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Manager Details</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFA500" />
                </View>
            </SafeAreaView>
        );
    }

    if (error || !manager) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={24} color="#FFA500" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Manager Details</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error loading manager details</Text>
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
                    <Ionicons name="chevron-back" size={24} color="#FFA500" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manager Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name</Text>
                    <Text style={styles.detailValue}>{manager.name}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone</Text>
                    <Text style={styles.detailValue}>{manager.phone}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>{manager.email}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>DOB</Text>
                    <Text style={styles.detailValue}>{formatDate(manager.dateOfBirth)}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Gender</Text>
                    <Text style={styles.detailValue}>{manager.gender || "N/A"}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Branch</Text>
                    <Text style={styles.detailValue}>{manager.branch}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEdit}
                    >
                        <Text style={styles.editButtonText}>EDIT DETAILS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.deleteButtonText}>DELETE</Text>
                        )}
                    </TouchableOpacity>
                </View>
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
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000000",
    },
    detailValue: {
        fontSize: 16,
        color: "#000000",
        textAlign: "right",
    },
    separator: {
        height: 1,
        backgroundColor: "#F0F0F0",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 32,
    },
    editButton: {
        backgroundColor: "#FFA500",
        borderRadius: 8,
        padding: 16,
        flex: 1,
        marginRight: 8,
        alignItems: "center",
    },
    editButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: "#E74C3C",
        borderRadius: 8,
        padding: 16,
        flex: 1,
        marginLeft: 8,
        alignItems: "center",
    },
    deleteButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
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
        color: "#E74C3C",
    },
});

export default ManagerDetails;