import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const HomeSkeletonView = () => {
    const fadeAnim = useRef(new Animated.Value(0.3)).current;

    // Animation effect
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <View style={styles.container}>
            {/* Header Skeleton */}
            <View style={styles.headerContainer}>
                <Animated.View
                    style={[styles.headerTitle, { opacity: fadeAnim }]}
                />
                <Animated.View
                    style={[styles.headerAvatar, { opacity: fadeAnim }]}
                />
            </View>

            {/* Vendor Details Skeleton */}
            <View style={styles.vendorContainer}>
                <View style={styles.vendorHeaderRow}>
                    <Animated.View
                        style={[styles.vendorTitle, { opacity: fadeAnim }]}
                    />
                    <Animated.View
                        style={[styles.vendorStatus, { opacity: fadeAnim }]}
                    />
                </View>
                <Animated.View
                    style={[styles.vendorDescription1, { opacity: fadeAnim }]}
                />
                <Animated.View
                    style={[styles.vendorDescription2, { opacity: fadeAnim }]}
                />
                <Animated.View
                    style={[styles.vendorButton, { opacity: fadeAnim }]}
                />
            </View>

            {/* Divider Skeleton */}
            <Animated.View style={[styles.divider, { opacity: fadeAnim }]} />

            {/* Slots Skeleton */}
            <View style={styles.slotsContainer}>
                <View style={styles.slotsHeaderRow}>
                    <Animated.View
                        style={[styles.slotsTitle, { opacity: fadeAnim }]}
                    />
                    <Animated.View
                        style={[styles.slotsDate, { opacity: fadeAnim }]}
                    />
                </View>

                <Animated.View
                    style={[styles.slotsTabs, { opacity: fadeAnim }]}
                />

                {/* Slot Items */}
                <Animated.View
                    style={[styles.slotItem, { opacity: fadeAnim }]}
                />
                <Animated.View
                    style={[
                        styles.slotItem,
                        { opacity: fadeAnim, marginTop: 15 },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.slotItem,
                        { opacity: fadeAnim, marginTop: 15 },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 21,
        paddingTop: 60,
        backgroundColor: "#FFFFFF",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        width: 150,
        height: 25,
        backgroundColor: "#E1E9EE",
        borderRadius: 4,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E1E9EE",
    },
    vendorContainer: {
        marginTop: 20,
    },
    vendorHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    vendorTitle: {
        width: 180,
        height: 20,
        backgroundColor: "#E1E9EE",
        borderRadius: 4,
    },
    vendorStatus: {
        width: 60,
        height: 25,
        backgroundColor: "#E1E9EE",
        borderRadius: 4,
    },
    vendorDescription1: {
        marginTop: 10,
        width: "100%",
        height: 15,
        backgroundColor: "#E1E9EE",
        borderRadius: 4,
    },
    vendorDescription2: {
        marginTop: 5,
        width: "80%",
        height: 15,
        backgroundColor: "#E1E9EE",
        borderRadius: 4,
    },
    vendorButton: {
        marginTop: 15,
        width: "100%",
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E1E9EE",
    },
    divider: {
        marginTop: 20,
        width: "100%",
        height: 1,
        backgroundColor: "#E1E9EE",
    },
    slotsContainer: {
        marginTop: 20,
    },
    slotsHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    slotsTitle: {
        width: 120,
        height: 20,
        backgroundColor: "#E1E9EE",
        borderRadius: 4,
    },
    slotsDate: {
        width: 80,
        height: 20,
        backgroundColor: "#E1E9EE",
        borderRadius: 4,
    },
    slotsTabs: {
        marginTop: 15,
        width: "100%",
        height: 40,
        backgroundColor: "#E1E9EE",
        borderRadius: 4,
    },
    slotItem: {
        marginTop: 10,
        width: "100%",
        height: 70,
        borderRadius: 8,
        backgroundColor: "#E1E9EE",
    },
});

export default HomeSkeletonView;
