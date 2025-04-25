import React, { useEffect, useState, useMemo } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Platform,
    Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useQuery } from "@tanstack/react-query";
import { fetchMealByKitchenPartnerId } from "../api/getApi/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

export default function MyMealItemsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<
        "Breakfast" | "Lunch" | "Dinner"
    >("Breakfast");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{
        id: number;
        name: string;
    } | null>(null);

    const [kitchenPartnerId, setKitchenPartnerId] = useState<string>("");

    useEffect(() => {
        const fetchVendorData = async () => {
            try {
                const storedData = await AsyncStorage.getItem("data");
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    setKitchenPartnerId(parsedData?.kitchenPartner?.id || "");
                }
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchVendorData();
    }, []);

    // Fetch meal data from API
    const { data, isLoading, isError } = useQuery({
        queryKey: ["menuItems", kitchenPartnerId],
        queryFn: () => fetchMealByKitchenPartnerId(kitchenPartnerId),
        enabled: !!kitchenPartnerId, // Fetch only if kitchenPartnerId is available
    });

    // Categorize meals based on type dynamically
    const mealItems = useMemo(() => {
        if (!data?.meals) return { Breakfast: [], Lunch: [], Dinner: [] };

        return {
            Breakfast: data.meals.filter(
                (meal: any) => meal.type === "Breakfast" && meal.name
            ),
            Lunch: data.meals.filter(
                (meal: any) => meal.type === "Lunch" && meal.name
            ),
            Dinner: data.meals.filter(
                (meal: any) => meal.type === "Dinner" && meal.name
            ),
        };
    }, [data?.meals]);

    const handleDeletePress = (item: { id: number; name: string }) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        // Implement delete logic here
        setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    // Generate a consistent color based on the meal name
    const getMealColor = (name: string) => {
        const colors = ["#FF7043", "#4CAF50", "#5C6BC0", Colors.secondary, "#9C27B0"];
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const renderItem = ({ item }: { item: { id: number; name: string } }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemLeftSection}>
                <View style={[styles.itemIcon, { backgroundColor: getMealColor(item.name) }]}>
                    <MaterialCommunityIcons name="food" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push(`/`)}
                >
                    <MaterialCommunityIcons name="pencil" size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePress(item)}
                >
                    <MaterialCommunityIcons name="delete" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <MaterialCommunityIcons name="food-off" size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No {activeTab} Items</Text>
            <Text style={styles.emptyStateSubtitle}>
                Add new meal items to see them here
            </Text>
        </View>
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
                    <Ionicons name="chevron-back" size={24} color={Colors.secondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Meal Items</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Banner */}
            <View style={styles.bannerContainer}>
                <LinearGradient
                    colors={[Colors.secondary, '#FF9800']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.bannerGradient}
                >
                    <View style={styles.bannerContent}>
                        <MaterialCommunityIcons name="silverware-variant" size={36} color="#FFFFFF" />
                        <View style={styles.bannerTextContainer}>
                            <Text style={styles.bannerTitle}>Meal Items</Text>
                            <Text style={styles.bannerSubtitle}>Manage your meal items collection</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                {(["Breakfast", "Lunch", "Dinner"] as const).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            activeTab === tab && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text 
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Loading & Error Handling */}
            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator
                        size="large"
                        color={Colors.secondary}
                    />
                    <Text style={styles.loaderText}>Loading meal items...</Text>
                </View>
            ) : isError ? (
                <View style={styles.errorContainer}>
                    <MaterialCommunityIcons name="alert-circle" size={48} color="#FF5252" />
                    <Text style={styles.errorText}>
                        Failed to load meals. Try again later.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={mealItems[activeTab]}
                    renderItem={renderItem}
                    keyExtractor={(item) =>
                        item.id ? item.id.toString() : Math.random().toString()
                    }
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Add New Item Button */}
            <View style={styles.addButtonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push("/(screens)/addNewItems")}
                    activeOpacity={0.8}
                >
                    <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>ADD NEW ITEM</Text>
                </TouchableOpacity>
            </View>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                visible={showDeleteModal}
                itemName={itemToDelete?.name || ""}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
    },
    headerTitle: {
        color: Colors.secondary,
        fontSize: 18,
        fontFamily: "nunito-b",
    },
    headerRight: {
        width: 40,
    },
    bannerContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    bannerGradient: {
        flex: 1,
        padding: 16,
    },
    bannerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerTextContainer: {
        marginLeft: 16,
    },
    bannerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: "nunito-b",
        marginBottom: 4,
    },
    bannerSubtitle: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: "nunito",
        opacity: 0.9,
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: Colors.background,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 8,
        padding: 4,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: Colors.secondary,
    },
    tabText: {
        color: "#666666",
        fontFamily: "nunito",
        fontSize: 14,
    },
    activeTabText: {
        color: "#FFFFFF",
        fontFamily: "nunito-b",
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.background,
        borderRadius: 12,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    itemLeftSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    itemName: {
        fontSize: 16,
        fontFamily: "nunito-b",
        color: Colors.primary,
    },
    actionsContainer: {
        flexDirection: "row",
    },
    editButton: {
        backgroundColor: Colors.secondary,
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    deleteButton: {
        backgroundColor: "#FF5252",
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    addButtonContainer: {
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
    },
    addButton: {
        backgroundColor: Colors.secondary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 12,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    addButtonText: {
        color: "#FFFFFF",
        fontFamily: "nunito-b",
        fontSize: 16,
        marginLeft: 8,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loaderText: {
        marginTop: 12,
        color: "#666666",
        fontFamily: "nunito",
        fontSize: 14,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        textAlign: "center",
        marginTop: 12,
        color: "#FF5252",
        fontFamily: "nunito",
        fontSize: 14,
    },
    emptyStateContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontFamily: "nunito-b",
        color: "#666666",
        marginTop: 16,
    },
    emptyStateSubtitle: {
        fontSize: 14,
        fontFamily: "nunito",
        color: "#999999",
        marginTop: 8,
        textAlign: "center",
    },
});
