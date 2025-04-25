import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const _layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.secondary,
                tabBarLabelStyle: {
                    fontFamily: "nunito-b",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="person-circle"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="menu"
                options={{
                    tabBarLabel: "Menu",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="restaurant"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />

            {/* <Tabs.Screen
                name="payments"
                options={{
                    tabBarLabel: "Payments",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="payment"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            /> */}
        </Tabs>
    );
};

export default _layout;

const styles = StyleSheet.create({});
