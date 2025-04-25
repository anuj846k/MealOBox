import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { useMutation } from "@tanstack/react-query";
import { loginKitchenPartner } from "../api/postApi/postApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface formDataProps {
    email: string;
    password: string;
}
const Login = () => {
    const [formData, setFormData] = useState<formDataProps>({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem("accessToken");
                if (token) {
                    router.replace("/(tabs)");
                }
            } catch (error) {
                console.error("Error checking token:", error);
            } finally {
                setLoading(false);
            }
        };

        checkToken();
    }, []);

    const mutation = useMutation({
        mutationFn: loginKitchenPartner,
        onSuccess: async (data) => {
            console.log(data);
            await AsyncStorage.setItem("accessToken", data.token);
            await AsyncStorage.setItem("data", JSON.stringify(data));
            router.replace("/(tabs)");
        },
        onError: (error: any) => {
            console.error("Login failed:", error);
            if (error.response) {
                console.error("Server response:", error.response);
            }
        },
    });

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.secondary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                bounces={false}
                scrollEnabled={false}
            >
                <View style={styles.container}>
                    <Stack.Screen
                        options={{
                            headerShown: false,
                        }}
                    />
                    <SafeAreaView style={styles.loginHeader}>
                        <Image
                            source={require("@/assets/images/rolling-pin.png")}
                            style={styles.rollingPin}
                            resizeMode="contain"
                        />
                        <View style={styles.logoContainer}>
                            <Image
                                source={require("@/assets/images/logo.png")}
                                style={{ marginTop: 40 }}
                            />
                        </View>
                        <Image
                            source={require("@/assets/images/chef.png")}
                            style={styles.chefImage}
                            resizeMode="contain"
                        />
                        <Image
                            source={require("@/assets/images/spatula.png")}
                            style={styles.spatulaImage}
                            resizeMode="contain"
                        />
                        <View style={styles.headingContainer}>
                            <Text style={styles.heading}>Ready to Grow</Text>
                            <Text style={styles.heading}>
                                Your Tiffin Service?
                            </Text>
                        </View>
                    </SafeAreaView>

                    <View style={styles.loginDetailsContainer}>
                        <Text style={styles.welcomeText}>
                            Welcome to MealOBox Vendor!
                        </Text>
                        <Text style={styles.subText}>
                            Serve homemade meals to customers looking for homely
                            food.
                        </Text>

                        <View style={styles.login}>
                            <Text style={styles.loginText}>Login Here!</Text>

                            <TextInput
                                placeholder="Enter Your Partner ID"
                                style={styles.input}
                                placeholderTextColor={Colors.gray}
                                value={formData.email}
                                onChangeText={(text) =>
                                    handleChange("email", text)
                                }
                            />

                            <TextInput
                                placeholder="Password"
                                style={styles.input}
                                placeholderTextColor={Colors.gray}
                                value={formData.password}
                                secureTextEntry
                                onChangeText={(text) =>
                                    handleChange("password", text)
                                }
                            />

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.continueButtonText}>
                                    CONTINUE
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.phoneLoginContainer}>
                                <TouchableOpacity
                                    onPress={() =>
                                        router.push("/(auth)/phoneLogin")
                                    }
                                >
                                    <Text style={styles.phoneLoginText}>
                                        Login with Phone Number
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.joinContainer}>
                                <Text style={styles.joinText}>
                                    Want to join MealOBox as a Vendor?{" "}
                                </Text>
                                <TouchableOpacity>
                                    <Text style={styles.contactText}>
                                        Contact us
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.background,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background,
    },
    loginHeader: {
        width: "100%",
        backgroundColor: Colors.secondary,
        height: Dimensions.get("window").height * 0.45,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        position: "relative",
        overflow: "hidden",
    },
    logoContainer: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 2,
    },
    logoText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    rollingPin: {
        position: "absolute",
        top: 70,
        left: -50,
        width: 180,
        height: 180,
        // opacity: 0.3,
    },
    chefImage: {
        position: "absolute",
        top: 60,
        left: "50%",
        marginLeft: -140,
        width: 280,
        height: 280,
    },
    spatulaImage: {
        position: "absolute",
        bottom: 20,
        right: 1,
        width: 120,
        height: 120,
    },
    headingContainer: {
        position: "absolute",
        bottom: 10,
        left: 10,
        right: 20,
    },
    heading: {
        fontSize: 36,
        fontFamily: "nunito-b",
        fontWeight: "bold",
        color: "#FFFFFF",
        lineHeight: 42,
    },
    loginDetailsContainer: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: Platform.OS === "ios" ? 34 : 24,
    },
    welcomeText: {
        fontSize: 20,
        fontFamily: "nunito-sb",
        color: "#000000",
        marginBottom: 8,
    },
    subText: {
        fontFamily: "nunito",
        fontSize: 14,
        color: Colors.gray,
        marginBottom: 24,
    },
    login: {
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        gap: 16,
    },
    loginText: {
        fontFamily: "nunito-b",
        fontSize: 20,
        color: "#000000",
    },
    input: {
        height: 50,
        width: "100%",
        borderWidth: 1,
        borderColor: Colors.secondary,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontFamily: "nunito",
    },
    forgotPasswordContainer: {
        alignItems: "flex-end",
        width: "100%",
    },
    forgotPasswordText: {
        color: Colors.gray,
        fontSize: 14,
        fontFamily: "nunito",
    },
    continueButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: Colors.secondary,
        borderRadius: 8,
        height: 50,
        marginTop: 10,
    },
    continueButtonText: {
        fontFamily: "nunito-b",
        color: Colors.background,
        fontSize: 16,
    },
    joinContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginTop: 20,
    },
    joinText: {
        color: Colors.primary,
        fontSize: 14,
        fontFamily: "nunito",
    },
    contactText: {
        color: Colors.secondary,
        fontSize: 14,
        fontFamily: "nunito-b",
    },
    phoneLoginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginTop: 10,
    },
    phoneLoginText: {
        color: Colors.gray,
        fontSize: 14,
        fontFamily: "nunito",
    },
});
