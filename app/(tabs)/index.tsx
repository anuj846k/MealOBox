import {
    SafeAreaView,
    FlatList,
    StyleSheet,
    View,
    Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import Header from "@/components/homeComponents/Header";
import Colors from "@/constants/Colors";
import VendorDetails from "@/components/homeComponents/VendorDetails";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Divider from "@/elements/Divider";
import Slots from "@/components/homeComponents/Slots";
import HomeSkeletonView from "@/components/homeComponents/HomeSkeletonView";

const index = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(true);

    // Simulate API loading time
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const renderContent = () => [
        <View key="header">
            {Platform.OS === "android" ? (
                <SafeAreaView>
                    <Header />
                </SafeAreaView>
            ) : (
                <View>
                    <Header />
                </View>
            )}
        </View>,
        <View
            key="vendorDetails"
            style={{ marginTop: 12, paddingHorizontal: 21 }}
        >
            <VendorDetails onOpenStateChange={(state) => setIsOpen(state)} />
        </View>,
        <View key="divider" style={{ marginTop: 12 }}>
            <Divider />
        </View>,
        <View key="slots" style={{ marginTop: 12, paddingHorizontal: 21 }}>
            <Slots isOpen={isOpen} />
        </View>,
    ];

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <Stack.Screen
                    options={{
                        headerShown: false,
                        headerStyle: { backgroundColor: "transparent" },
                        headerTransparent: true,
                    }}
                />

                {isLoading ? (
                    <HomeSkeletonView />
                ) : (
                    <FlatList
                        data={renderContent()}
                        renderItem={({ item }) => item}
                        keyExtractor={(_, index) => index.toString()}
                        contentContainerStyle={{
                            flexGrow: 1,
                            backgroundColor: Colors.background,
                        }}
                    />
                )}
            </View>
        </GestureHandlerRootView>
    );
};

export default index;
