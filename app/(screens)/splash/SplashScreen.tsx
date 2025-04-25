import { useEffect, useRef, useState } from "react";
import { View, Dimensions, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";

export default function CustomSplashScreen({
    onAnimationComplete,
}: {
    onAnimationComplete: () => void;
}) {
    const screenWidth = Dimensions.get("window").width;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [showSplash, setShowSplash] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSplashStatus = async () => {
            const hasSeenSplash = await AsyncStorage.getItem("hasSeenSplash");
            if (hasSeenSplash) {
                setShowSplash(false);
                onAnimationComplete();
            } else {
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }).start(() => {
                    setTimeout(async () => {
                        await AsyncStorage.setItem("hasSeenSplash", "true");
                        onAnimationComplete();
                    }, 500);
                });
            }
        };

        checkSplashStatus();
    }, []);

    if (!showSplash) return null;

    return (
        <View style={{ flex: 1, width: "100%", height: "100%" }}>
            <StatusBar style="light" />
            <View
                style={{
                    backgroundColor: Colors.secondary,
                    width: "100%",
                    height: "100%",
                }}
            >
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Animated.Image
                        source={require("@/assets/images/logo.png")}
                        style={{
                            resizeMode: "contain",
                            width: screenWidth * 0.8,
                            height: 300,
                            opacity: fadeAnim,
                        }}
                    />
                </View>
            </View>
        </View>
    );
}
