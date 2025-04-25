import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Image,
    Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";

const menu = () => {
    const router = useRouter();
    
    const menuItems = [
        {
            id: 1,
            title: "My Meals",
            subtitle: "Add or update meal details based on meal type",
            icon: "food-variant",
            route: "/(screens)/myMeals",
            color: "#FF7043",
        },
        {
            id: 2,
            title: "My Meal Items",
            subtitle: "Add or update meal items based on meal type",
            icon: "food",
            route: "/(screens)/myMealItems",
            color: "#4CAF50",
        },
        {
            id: 3,
            title: "Meal Categories",
            subtitle: "Manage your meal categories and organization",
            icon: "food-fork-drink",
            route: "/(screens)/myMeals", // Update with actual route
            color: "#5C6BC0",
        },
        {
            id: 4,
            title: "Special Offers",
            subtitle: "Create and manage special offers and discounts",
            icon: "tag-outline",
            route: "/(screens)/myMeals", // Update with actual route
            color: "#FFC107",
        },
    ];

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
                <Text style={styles.headerTitle}>Meal Menu</Text>
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search-outline" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
            
                <View style={styles.menuGrid}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuCard}
                            onPress={() => router.push(item.route)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                                <MaterialCommunityIcons name={item.icon} size={28} color="#FFFFFF" />
                            </View>
                            <Text style={styles.menuItemTitle}>{item.title}</Text>
                            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                            <View style={styles.arrowContainer}>
                                <Ionicons name="chevron-forward" size={16} color="#AAAAAA" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsContainer}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    
                    <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.7}>
                        <View style={styles.quickActionIcon}>
                            <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                        </View>
                        <View style={styles.quickActionContent}>
                            <Text style={styles.quickActionTitle}>Add New Meal</Text>
                            <Text style={styles.quickActionSubtitle}>Create a new meal offering</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.7}>
                        <View style={styles.quickActionIcon}>
                            <Ionicons name="analytics-outline" size={24} color={Colors.primary} />
                        </View>
                        <View style={styles.quickActionContent}>
                            <Text style={styles.quickActionTitle}>Menu Analytics</Text>
                            <Text style={styles.quickActionSubtitle}>View performance metrics</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default menu;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        marginBottom:29,
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
    scrollView: {
        flex: 1,
        backgroundColor: "#F9F9F9",
    },
    scrollViewContent: {
        paddingBottom: 24,
    },
    bannerContainer: {
        margin: 16,
        height: 140,
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
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.4)',
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
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    menuCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    menuItemTitle: {
        fontSize: 16,
        fontFamily: "nunito-b",
        color: Colors.primary,
        marginBottom: 4,
    },
    menuItemSubtitle: {
        fontSize: 12,
        fontFamily: "nunito",
        color: "#666666",
        lineHeight: 16,
        marginBottom: 12,
    },
    arrowContainer: {
        position: 'absolute',
        bottom: 12,
        right: 12,
    },
    quickActionsContainer: {
        marginTop: 8,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: "nunito-b",
        color: Colors.primary,
        marginBottom: 12,
    },
    quickActionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
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
    quickActionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    quickActionContent: {
        flex: 1,
    },
    quickActionTitle: {
        fontSize: 14,
        fontFamily: "nunito-b",
        color: Colors.primary,
    },
    quickActionSubtitle: {
        fontSize: 12,
        fontFamily: "nunito",
        color: "#666666",
    },
});
