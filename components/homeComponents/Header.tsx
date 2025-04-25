import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
    Platform,
    ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const Header = () => {
    const [vendorName, setVendorName] = useState<string>("");
    const [vendorImage, setVendorImage] = useState<string>("");
    const [vendorRating, setVendorRating] = useState<string>("4.8");
    const [vendorType, setVendorType] = useState<string>("South Indian (Pure Veg)");
    const [vendorLocation, setVendorLocation] = useState<string>("Kalkaji");
    const [vendorMeals, setVendorMeals] = useState<string[]>(["Breakfast", "Lunch", "Dinner"]);

    useEffect(() => {
        const fetchVendorData = async () => {
            try {
                const storedData = await AsyncStorage.getItem("data");
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    setVendorName(
                        parsedData.kitchenPartner.kitchenName ||
                        "Vendor"
                    );
                    setVendorImage(
                        parsedData.kitchenPartner.imageUrl || 
                        "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1000&auto=format&fit=crop"
                    );
                }
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchVendorData();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            <ImageBackground 
                source={{ uri: vendorImage || "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1000&auto=format&fit=crop" }} 
                style={styles.imageBackground}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.5)']}
                    style={styles.gradient}
                >
                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => router.push("/(screens)/settings")}
                        >
                            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </ImageBackground>

            <View style={styles.kitchenInfoCard}>
                <View style={styles.nameRatingRow}>
                    <Text style={styles.kitchenName}>{vendorName}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>{vendorRating}</Text>
                    </View>
                </View>
                
                <View style={styles.cuisineRow}>
                    <View style={styles.vegIndicator}>
                        <View style={styles.vegDot} />
                    </View>
                    <Text style={styles.cuisineText}>{vendorType}</Text>
                </View>
                
                <View style={styles.mealTypesRow}>
                    {vendorMeals.map((meal, index) => (
                        <React.Fragment key={meal}>
                            <Text style={styles.mealTypeText}>{meal}</Text>
                            {index < vendorMeals.length - 1 && (
                                <Text style={styles.mealSeparator}>•</Text>
                            )}
                        </React.Fragment>
                    ))}
                </View>
                
                <Text style={styles.locationText}>{vendorLocation}</Text>
            </View>
            
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
    },
    imageBackground: {
        width: "100%",
        height: 200,
    },
    gradient: {
        width: "100%",
        height: "100%",
    },
    headerButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    kitchenInfoCard: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.background,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        marginTop: -20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    nameRatingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    kitchenName: {
        fontSize: 24,
        fontFamily: "nunito-b",
        color: Colors.primary,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF9C4",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        fontSize: 14,
        fontFamily: "nunito-b",
        color: "#000",
        marginLeft: 4,
    },
    cuisineRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    vegIndicator: {
        width: 16,
        height: 16,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "green",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    vegDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "green",
    },
    cuisineText: {
        fontSize: 14,
        fontFamily: "nunito",
        color: Colors.primary,
    },
    mealTypesRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    mealTypeText: {
        fontSize: 14,
        fontFamily: "nunito",
        color: Colors.primary,
    },
    mealSeparator: {
        fontSize: 14,
        fontFamily: "nunito",
        color: Colors.primary,
        marginHorizontal: 6,
    },
    locationText: {
        fontSize: 14,
        fontFamily: "nunito",
        color: Colors.primary,
    },
    dateStatusContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    dateText: {
        fontSize: 16,
        fontFamily: "nunito-b",
        color: Colors.primary,
    },
    timeText: {
        fontSize: 14,
        fontFamily: "nunito",
        color: Colors.primary,
    },
    statusButtonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    statusButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        alignSelf: "flex-start",
    },
    openButton: {
        backgroundColor: "#FFC107",
    },
    closedButton: {
        backgroundColor: "#E0E0E0",
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#FFFFFF",
        marginRight: 8,
    },
    statusText: {
        fontSize: 16,
        fontFamily: "nunito-b",
        color: "#FFFFFF",
    },
});
