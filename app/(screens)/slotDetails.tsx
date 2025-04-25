import React, { useMemo, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    Platform,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { fetchSlotsOrders } from "../api/getApi/getApi";
import { useQuery } from "@tanstack/react-query";
import MapView, {
    Marker,
    PROVIDER_DEFAULT,
    PROVIDER_GOOGLE,
} from "react-native-maps";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

export default function SlotDetailsScreen() {
    const params = useLocalSearchParams();
    const slotId = params.id;
    const { data, isLoading, error } = useQuery({
        queryKey: ["slotDetails", slotId],
        queryFn: () => fetchSlotsOrders(slotId as string),
        enabled: !!slotId,
    });

    const mapRef = useRef<MapView>(null);

    // Memoize initialRegion to prevent recalculations
    const initialRegion = useMemo(() => {
        return {
            latitude: data?.kitchenLocation?.latitude || 28.6139,
            longitude: data?.kitchenLocation?.longitude || 77.209,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
    }, [data?.kitchenLocation?.latitude, data?.kitchenLocation?.longitude]);

    const goToKitchen = () => {
        if (
            data?.kitchenLocation?.latitude &&
            data?.kitchenLocation?.longitude
        ) {
            mapRef.current?.animateToRegion(
                {
                    latitude: data.kitchenLocation.latitude,
                    longitude: data.kitchenLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                },
                1000
            );
        }
    };

    // Marker color based on number of meals
    const getMarkerColor = (meals: number) => {
        if (meals > 30) return "#E53935";
        if (meals > 10) return "#FB8C00";
        return "#4CAF50";
    };
    
    const renderAreaItem = ({
        item,
    }: {
        item: { name: string; distance: string; meals: number };
    }) => (
        <TouchableOpacity
            style={styles.areaItem}
            onPress={() => {
                router.push({
                    pathname: "/slotAreaOrders",
                    params: { slotId, area: item.name },
                });
            }}
            accessibilityLabel={`View orders for ${item.name}`}
            accessibilityRole="button"
        >
            <View style={styles.areaLeft}>
                <MaterialCommunityIcons 
                    name="map-marker-radius" 
                    size={20} 
                    color={getMarkerColor(item.meals)} 
                    style={styles.areaIcon}
                />
                <Text style={styles.areaName}>{item.name.length > 10 ? item.name.slice(0, 8) + '...' : item.name}</Text>
            </View>
            <View style={styles.areaCenter}>
                <MaterialCommunityIcons name="map-marker-distance" size={16} color="#777777" style={styles.distanceIcon} />
                <Text style={styles.areaDetail}>{item.distance}</Text>
            </View>
            <View style={styles.areaRight}>
                <MaterialCommunityIcons name="food" size={16} color="#777777" style={styles.mealIcon} />
                <Text style={styles.areaDetail}>{item.meals}</Text>
                <MaterialCommunityIcons name="chevron-right" size={16} color="#CCCCCC" />
            </View>
        </TouchableOpacity>
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
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.secondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Slot Details</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Scrollable Content */}
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                bounces={false}
            >
                <View style={styles.bannerContainer}>
                    <LinearGradient
                        colors={[Colors.secondary, '#FF9800']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.bannerGradient}
                    >
                        <View style={styles.bannerContent}>
                            <MaterialCommunityIcons name="clock-time-four" size={20} color="#FFFFFF" />
                            <View style={styles.bannerTextContainer}>
                                <View style={styles.bannerTextRow}>
                                    <Text style={styles.bannerTitle}>
                                        {isLoading ? "Loading..." : error ? "Error" : data?.slotDetails.serving}
                                    </Text>
                                    <Text style={styles.bannerDot}>•</Text>
                                    <Text style={styles.bannerSubtitle}>
                                        {isLoading ? "Loading..." : error ? "Error" : data?.slotDetails.time}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Delivery Info Card */}
                <View style={styles.deliveryInfoCard}>
                    <View style={styles.deliveryInfoItem}>
                        <MaterialCommunityIcons name="food-takeout-box" size={20} color={Colors.secondary} />
                        <Text style={styles.deliveryInfoLabel}>Total Deliveries</Text>
                        <Text style={styles.deliveryInfoValue}>
                            {isLoading ? "0" : error ? "0" : data?.slotDetails.totalDeliveries}
                        </Text>
                    </View>
                    <View style={styles.deliveryInfoDivider} />
                    <View style={styles.deliveryInfoItem}>
                        <MaterialCommunityIcons name="account" size={20} color={Colors.secondary} />
                        <Text style={styles.deliveryInfoLabel}>Assigned To</Text>
                        <Text style={styles.deliveryInfoValue}>
                            {isLoading ? "Loading..." : error ? "Error" : data?.slotDetails.assignedTo}
                        </Text>
                    </View>
                </View>

                {/* Map Container */}
                <View style={styles.mapContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="map" size={20} color={Colors.secondary} />
                        <Text style={styles.sectionTitle}>Delivery Map</Text>
                    </View>
                    
                    {isLoading || error ? (
                        <View style={styles.mapPlaceholder}>
                            {isLoading ? (
                                <View style={styles.mapLoaderContainer}>
                                    <ActivityIndicator size="large" color={Colors.secondary} />
                                    <Text style={styles.mapLoaderText}>Loading Map...</Text>
                                </View>
                            ) : (
                                <View style={styles.mapErrorContainer}>
                                    <MaterialCommunityIcons name="map-marker-alert" size={48} color="#FF5252" />
                                    <Text style={styles.mapErrorText}>Error loading map</Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        <MapView
                            ref={mapRef}
                            style={styles.mapContent}
                            provider={
                                Platform.OS === "android"
                                    ? PROVIDER_GOOGLE
                                    : PROVIDER_DEFAULT
                            }
                            initialRegion={initialRegion}
                        >
                            {data?.kitchenLocation?.latitude != null &&
                                data?.kitchenLocation?.longitude != null && (
                                    <Marker
                                        coordinate={{
                                            latitude: data.kitchenLocation.latitude,
                                            longitude:
                                                data.kitchenLocation.longitude,
                                        }}
                                        title="Kitchen Location"
                                        accessibilityLabel="Kitchen Location Marker"
                                    >
                                        <View style={styles.kitchenMarkerPin}>
                                            <MaterialCommunityIcons
                                                name="silverware-fork-knife"
                                                size={14}
                                                color="#FFFFFF"
                                            />
                                        </View>
                                        <View style={styles.kitchenMarkerLabel}>
                                            <Text style={styles.kitchenMarkerText}>
                                                Kitchen
                                            </Text>
                                        </View>
                                    </Marker>
                                )}

                            {data?.areas?.map(
                                (area: {
                                    name: string;
                                    coordinates: {
                                        latitude: number;
                                        longitude: number;
                                    };
                                    meals: number;
                                    distance: string;
                                }) => {
                                    const latitude = area.coordinates?.latitude;
                                    const longitude = area.coordinates?.longitude;
                                    
                                    if (latitude != null && longitude != null) {
                                        return (
                                            <Marker
                                                key={area.name}
                                                coordinate={{ latitude, longitude }}
                                                title={area.name}
                                                description={`${area.meals} meals • ${area.distance} m`}
                                                accessibilityLabel={`${area.name} Marker`}
                                            >
                                                <View
                                                    style={[
                                                        styles.mapMarker,
                                                        {
                                                            backgroundColor:
                                                                getMarkerColor(
                                                                    area.meals
                                                                ),
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={styles.mapMarkerText}
                                                    >
                                                        {area.meals}
                                                    </Text>
                                                </View>
                                            </Marker>
                                        );
                                    }
                                    return null;
                                }
                            )}
                        </MapView>
                    )}

                    <View style={styles.mapControls}>
                        <TouchableOpacity
                            style={styles.mapControlButton}
                            onPress={goToKitchen}
                            accessibilityLabel="Go to kitchen location"
                        >
                            <MaterialIcons
                                name="my-location"
                                size={24}
                                color={Colors.secondary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Areas List */}
                <View style={styles.areasContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="format-list-bulleted" size={20} color={Colors.secondary} />
                        <Text style={styles.sectionTitle}>Delivery Areas</Text>
                    </View>
                    
                    <View style={styles.columnHeaders}>
                        <Text style={styles.columnHeader}>Area</Text>
                        <Text style={styles.columnHeader}>Distance</Text>
                        <Text style={styles.columnHeader}>Meals</Text>
                    </View>

                    <View style={styles.divider} />

                    {isLoading || error ? (
                        <View style={styles.noDeliveriesContainer}>
                            {isLoading ? (
                                <View style={styles.loaderContainer}>
                                    <ActivityIndicator size="large" color={Colors.secondary} />
                                    <Text style={styles.loaderText}>Loading areas...</Text>
                                </View>
                            ) : (
                                <View style={styles.errorContainer}>
                                    <MaterialCommunityIcons name="alert-circle" size={48} color="#FF5252" />
                                    <Text style={styles.errorText}>Error loading areas</Text>
                                </View>
                            )}
                        </View>
                    ) : data?.slotDetails.totalDeliveries > 0 ? (
                        <View style={styles.flatListContainer}>
                            {data?.areas?.map((item: any,) => renderAreaItem({ item }))}
                        </View>
                    ) : (
                        <View style={styles.noDeliveriesContainer}>
                            <MaterialCommunityIcons name="food-off" size={48} color="#CCCCCC" />
                            <Text style={styles.noDeliveriesTitle}>No Deliveries</Text>
                            <Text style={styles.noDeliveriesText}>
                                There are no deliveries scheduled for this slot
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 2,
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
        height: 50,
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
    bannerTextRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: "nunito-b",
        // marginBottom: 4,
    },
    bannerDot: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: "nunito",
        marginHorizontal: 4,
    },
    bannerSubtitle: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: "nunito",
        opacity: 0.9,
    },
    deliveryInfoCard: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        backgroundColor: Colors.background,
        borderRadius: 12,
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
    deliveryInfoItem: {
        flex: 1,
        alignItems: "center",
    },
    deliveryInfoDivider: {
        width: 1,
        backgroundColor: "#EEEEEE",
        marginHorizontal: 8,
    },
    deliveryInfoLabel: {
        fontSize: 12,
        color: "#666666",
        marginTop: 4,
        fontFamily: "nunito",
    },
    deliveryInfoValue: {
        fontSize: 16,
        color: Colors.primary,
        fontFamily: "nunito-b",
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        color: Colors.primary,
        fontFamily: "nunito-b",
        marginLeft: 8,
    },
    mapContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: Colors.background,
        borderRadius: 12,
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
    mapPlaceholder: {
        height: 200,
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    mapContent: {
        height: 200,
        borderRadius: 8,
        overflow: "hidden",
    },
    mapLoaderContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    mapLoaderText: {
        marginTop: 12,
        color: "#666666",
        fontFamily: "nunito",
    },
    mapErrorContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    mapErrorText: {
        marginTop: 12,
        color: "#FF5252",
        fontFamily: "nunito",
    },
    mapMarker: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#FF7043",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    mapMarkerText: {
        color: "#FFFFFF",
        fontFamily: "nunito-b",
        fontSize: 12,
    },
    kitchenMarkerPin: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.secondary,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    kitchenMarkerLabel: {
        backgroundColor: "#000000",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 20,
        marginTop: 2,
    },
    kitchenMarkerText: {
        color: "#FFFFFF",
        fontSize: 8,
        fontFamily: "nunito-b",
    },
    mapControls: {
        position: "absolute",
        right: 24,
        top: 56,
        gap: 8,
    },
    mapControlButton: {
        width: 40,
        height: 40,
        backgroundColor: "white",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
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
    areasContainer: {
        margin: 16,
        marginTop: 0,
        padding: 16,
        backgroundColor: Colors.background,
        borderRadius: 12,
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
    columnHeaders: {
        flexDirection: "row",
        paddingHorizontal: 8,
    },
    columnHeader: {
        flex: 1,
        fontSize: 12,
        color: "#666666",
        fontFamily: "nunito",
    },
    divider: {
        height: 1,
        backgroundColor: "#EEEEEE",
        marginVertical: 8,
    },
    flatListContainer: {
        paddingBottom: 8,
    },
    areasList: {
        paddingBottom: 16,
    },
    areaItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginVertical: 4,
        backgroundColor: "#F9F9F9",
        borderRadius: 8,
    },
    areaLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    areaIcon: {
        marginRight: 8,
    },
    areaCenter: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    distanceIcon: {
        marginRight: 4,
    },
    areaRight: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    mealIcon: {
        marginRight: 4,
    },
    areaName: {
        fontSize: 14,
        color: Colors.primary,
        fontFamily: "nunito-b",
    },
    areaDetail: {
        fontSize: 14,
        color: "#666666",
        fontFamily: "nunito",
    },
    loaderContainer: {
        padding: 24,
        alignItems: "center",
    },
    loaderText: {
        marginTop: 12,
        color: "#666666",
        fontFamily: "nunito",
        fontSize: 14,
    },
    errorContainer: {
        padding: 24,
        alignItems: "center",
    },
    errorText: {
        marginTop: 12,
        color: "#FF5252",
        fontFamily: "nunito",
        fontSize: 14,
    },
    noDeliveriesContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    noDeliveriesTitle: {
        fontSize: 18,
        color: "#666666",
        fontFamily: "nunito-b",
        marginTop: 12,
    },
    noDeliveriesText: {
        fontSize: 14,
        color: "#999999",
        fontFamily: "nunito",
        marginTop: 8,
        textAlign: "center",
    },
});
