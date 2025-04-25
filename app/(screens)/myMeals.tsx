// app/myMeals.tsx
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    StatusBar,
    Platform,
    ScrollView,
} from "react-native";
import { useLocalSearchParams, router, Stack, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchMyMeals } from "../api/getApi/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

const MyMealsScreen = () => {
    const params = useLocalSearchParams();
    const mealType = (params.mealType as string) || "Breakfast";
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Breakfast");

    const navigateToMealDetail = (mealId: string) => {
        router.push("/");
    };

    const [kitchenPartnerId, setKitchenPartnerId] = useState<string>("");

    useEffect(() => {
        const fetchKitchenPartnerId = async () => {
            try {
                const storedData = await AsyncStorage.getItem("data");
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    setKitchenPartnerId(parsedData.kitchenPartner?.id || null);
                }
            } catch (error) {
                console.error("Error fetching kitchenPartnerId:", error);
            }
        };

        fetchKitchenPartnerId();
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ["myMeals"],
        queryFn: () => fetchMyMeals(kitchenPartnerId),
    });

    const myMeals = data?.data || [];

    // Group meals by their mealType
    const breakfastMeals = myMeals.filter(
        (meal: { mealType: string }) => meal.mealType === "Breakfast"
    );
    const lunchMeals = myMeals.filter(
        (meal: { mealType: string }) => meal.mealType === "Lunch"
    );
    const dinnerMeals = myMeals.filter(
        (meal: { mealType: string }) => meal.mealType === "Dinner"
    );

    const renderMealItem = (item: any) => (
        <TouchableOpacity
            style={styles.mealCard}
            onPress={() => navigateToMealDetail(item.id)}
            activeOpacity={0.8}
        >
            <View style={styles.mealItemContent}>
                <View style={[styles.mealIcon, { backgroundColor: getMealColor(item.title) }]}>
                    <MaterialCommunityIcons name="food" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.mealTextContainer}>
                    <Text style={styles.mealTitle}>{item.title}</Text>
                    <Text style={styles.mealSubtitle}>{item.subtitle}</Text>
                </View>
            </View>
            <View style={styles.chevronContainer}>
                <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
            </View>
        </TouchableOpacity>
    );

    const getMealColor = (title: string) => {
        // Generate a consistent color based on the meal title
        const colors = ["#FF7043", "#4CAF50", "#5C6BC0", "#FFC107", "#9C27B0", "#3F51B5"];
        const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    // Function to render meals for the active tab
    const renderMeals = () => {
        let mealsToRender = [];
        let emptyMessage = "";

        switch (activeTab) {
            case "Breakfast":
                mealsToRender = breakfastMeals;
                emptyMessage = "No breakfast meals available";
                break;
            case "Lunch":
                mealsToRender = lunchMeals;
                emptyMessage = "No lunch meals available";
                break;
            case "Dinner":
                mealsToRender = dinnerMeals;
                emptyMessage = "No dinner meals available";
                break;
        }

        if (mealsToRender.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="food-off" size={48} color="#CCCCCC" />
                    <Text style={styles.emptyMessage}>{emptyMessage}</Text>
                    <Text style={styles.emptySubMessage}>Tap the button below to add a meal</Text>
                </View>
            );
        }

        return mealsToRender.map((item) => (
            <React.Fragment key={item._id}>
                {renderMealItem({
                    id: item._id,
                    title: item.mealTitle,
                    subtitle: item.mealItems.join(", "),
                })}
            </React.Fragment>
        ));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
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
                    <Ionicons name="chevron-back" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Meals</Text>
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search-outline" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Banner with Gradient */}
            <View style={styles.bannerContainer}>
                <LinearGradient
                    colors={[Colors.primary, '#FF9800']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.bannerGradient}
                >
                    <View style={styles.bannerContent}>
                        <MaterialCommunityIcons name="silverware-fork-knife" size={36} color="#FFFFFF" />
                        <View style={styles.bannerTextContainer}>
                            <Text style={styles.bannerTitle}>Meal Management</Text>
                            <Text style={styles.bannerSubtitle}>View and manage your meal offerings</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            {/* Meal Type Tabs */}
            <View style={styles.tabContainer}>
                {["Breakfast", "Lunch", "Dinner"].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tabButton,
                            activeTab === tab && styles.activeTabButton,
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Meal List */}
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mealsContainer}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading meals...</Text>
                        </View>
                    ) : (
                        renderMeals()
                    )}
                </View>
            </ScrollView>
            
            {/* Add Meal Button */}
            <View style={styles.addButtonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push("/(screens)/AddMeal")}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={24} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>ADD NEW MEAL</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F9F9",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        marginBottom: 20,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
    },
    headerTitle: {
        color: Colors.primary,
        fontSize: 18,
        fontFamily: "nunito-b",
    },
    searchButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
    },
    bannerContainer: {
        marginHorizontal: 16,
        height: 120,
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
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        backgroundColor: "#FFFFFF",
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
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 6,
    },
    activeTabButton: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontFamily: "nunito",
        color: "#666666",
    },
    activeTabText: {
        color: "#FFFFFF",
        fontFamily: "nunito-b",
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 100, // Extra space for the add button
    },
    mealsContainer: {
        padding: 16,
    },
    mealCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
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
    mealItemContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    mealIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    mealTextContainer: {
        flex: 1,
    },
    mealTitle: {
        fontSize: 16,
        fontFamily: "nunito-b",
        color: Colors.primary,
        marginBottom: 4,
    },
    mealSubtitle: {
        fontSize: 12,
        fontFamily: "nunito",
        color: "#666666",
    },
    chevronContainer: {
        padding: 4,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    emptyMessage: {
        fontSize: 16,
        fontFamily: "nunito-b",
        color: "#888888",
        marginTop: 16,
        textAlign: "center",
    },
    emptySubMessage: {
        fontSize: 14,
        fontFamily: "nunito",
        color: "#AAAAAA",
        marginTop: 8,
        textAlign: "center",
    },
    loadingContainer: {
        padding: 20,
        alignItems: "center",
    },
    loadingText: {
        fontSize: 14,
        fontFamily: "nunito",
        color: "#888888",
    },
    addButtonContainer: {
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
    },
    addButton: {
        backgroundColor: Colors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
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
        fontSize: 16,
        fontFamily: "nunito-b",
        marginLeft: 8,
    },
});

export default MyMealsScreen;
