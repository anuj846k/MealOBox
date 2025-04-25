import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    Animated,
    PanResponder,
    LayoutChangeEvent,
    Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleKitchenStatus } from "@/app/api/updateApi/updateApi";

interface VendorDetailsProps {
    onOpenStateChange: (isOpen: boolean) => void;
}

const VendorDetails = ({ onOpenStateChange }: VendorDetailsProps) => {
    const [selectedMeal, setSelectedMeal] = useState("Breakfast");
    const [isOpen, setIsOpen] = useState(true);
    const panX = useRef(new Animated.Value(0)).current;
    const [kitchenType, setKitchenType] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [containerWidth, setContainerWidth] = useState(0);
    const buttonWidth = 40; // Width of the slider button
    const padding = 8; // Total horizontal padding
    const [kitchenPartnerId, setKitchenPartnerId] = useState<string>("");

    // Add query client for cache updates
    const queryClient = useQueryClient();

    // Add mutation for status toggle
    const statusMutation = useMutation({
        mutationFn: () => toggleKitchenStatus(kitchenPartnerId),
        onSuccess: (data) => {
            // Update local state based on API response
            setIsOpen(data.isOpen);
            onOpenStateChange(data.isOpen);
            
            // Animate after state update
            Animated.spring(panX, {
                toValue: data.isOpen ? 0 : getMaxSlide(),
                friction: 5,
                useNativeDriver: true,
            }).start();
            
            // Invalidate and refetch any related queries
            queryClient.invalidateQueries({ queryKey: ["slots"] });
        },
        onError: (error) => {
            console.error("Failed to toggle kitchen status:", error);
            Alert.alert("Error", "Failed to update kitchen status");
        }
    });

    useEffect(() => {
        const fetchVendorName = async () => {
            try {
                const storedData = await AsyncStorage.getItem("data");
                console.log("storedData", storedData);
                if (storedData) {
                    const parsedDataKitchenType = JSON.parse(storedData);
                    setKitchenType(
                        parsedDataKitchenType.kitchenPartner.kitchenType
                    );

                    const parsedDataKitchenAddress = JSON.parse(storedData);
                    setAddress(parsedDataKitchenAddress.kitchenPartner.address);
                }
            } catch (error) {
                console.error("Error fetching vendor name:", error);
            }
        };

        fetchVendorName();
    }, []);

    useEffect(() => {
        const fetchKitchenPartnerId = async () => {
            try {
                const storedData = await AsyncStorage.getItem("data");
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    setKitchenPartnerId(parsedData.kitchenPartner?.id || null);
                    console.log(parsedData.kitchenPartner?.id || null);
                }
            } catch (error) {
                console.error("Error fetching kitchenPartnerId:", error);
            }
        };

        fetchKitchenPartnerId();
    }, []);

    // Calculate the maximum slide distance
    const getMaxSlide = () => {
        return containerWidth - buttonWidth - padding;
    };

    // Modify the toggleOpenState function
    const toggleOpenState = (open: boolean) => {
        // Call the API first
        statusMutation.mutate();
        
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            // Limit the drag within the slider bounds
            const maxSlide = getMaxSlide();

            if (isOpen) {
                // When open, we're moving from left to right
                const newX = Math.max(0, Math.min(maxSlide, gestureState.dx));
                panX.setValue(newX);
            } else {
                // When closed, we're moving from right to left
                const newX = Math.max(
                    0,
                    Math.min(maxSlide, maxSlide + gestureState.dx)
                );
                panX.setValue(newX);
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            // Determine whether to snap to open or closed position
            const maxSlide = getMaxSlide();
            const threshold = maxSlide / 2; // Half of the maximum slide distance

            if (isOpen) {
                // When open, check if dragged far enough to close
                if (gestureState.dx > threshold) {
                    toggleOpenState(false);
                } else {
                    toggleOpenState(true);
                }
            } else {
                // When closed, check if dragged far enough to open
                if (gestureState.dx < -threshold) {
                    toggleOpenState(true);
                } else {
                    toggleOpenState(false);
                }
            }
        },
    });

    // Handle direct tap on the slider
    const handleSliderTap = () => {
        toggleOpenState(!isOpen);
    };

    // Handle layout change to get container width
    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    return (
        <React.Fragment>
            {/* <View style={styles.restaurantInfo}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{kitchenType}</Text>
                    <View style={styles.vegIcon}>
                        <View style={styles.vegIconInner} />
                    </View>
                </View>

                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFC107" />
                    <Text style={styles.rating}>4.8</Text>
                </View>
            </View> */}

            {/* <View style={styles.detailsContainer}>
                <Text style={styles.detailsText}>
                    Breakfast • Lunch • Dinner
                </Text>
                <Text style={styles.detailsText}>{address}</Text>
            </View> */}

            <TouchableOpacity
                style={[
                    styles.sliderContainer,
                    !isOpen && styles.sliderContainerClosed,
                ]}
                activeOpacity={0.9}
                onPress={handleSliderTap}
                onLayout={handleLayout}
            >
                <Animated.View
                    style={[
                        styles.sliderButton,
                        { transform: [{ translateX: panX }] },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.sliderDot} />
                </Animated.View>
                <View style={styles.sliderTextContainer}>
                    <Text
                        style={[
                            styles.sliderText,
                            isOpen
                                ? styles.sliderTextOpen
                                : styles.sliderTextClosed,
                        ]}
                    >
                        {isOpen ? "OPEN" : "CLOSED"}
                    </Text>
                </View>
            </TouchableOpacity>
        </React.Fragment>
    );
};

export default VendorDetails;

const styles = StyleSheet.create({
    restaurantInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333333",
    },
    vegIcon: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: "#00A650",
        marginLeft: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    vegIconInner: {
        width: 8,
        height: 8,
        backgroundColor: "#00A650",
        borderRadius: 4,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFE082",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    rating: {
        marginLeft: 4,
        fontWeight: "bold",
        color: "#333333",
    },
    detailsContainer: {
        marginTop: 8,
    },
    detailsText: {
        color: "#666666",
        fontSize: 13,
    },
    sliderContainer: {
        backgroundColor: "#FFC107", // Yellow for open
        borderRadius: 24,
        height: 48,
        marginTop: 16,
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        paddingHorizontal: 4,
    },
    sliderContainerClosed: {
        backgroundColor: "#FF5252", // Red for closed
    },
    sliderButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        left: 4,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    sliderDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#FFC107",
    },
    sliderTextContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    sliderText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#FFFFFF",
    },
    sliderTextOpen: {
        marginLeft: 24, // Adjusted for new padding
    },
    sliderTextClosed: {
        marginRight: 24, // Adjusted for new padding
    },
});
