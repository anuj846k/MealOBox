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
    Image,
    SafeAreaView,
    Alert,
} from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { requestOtp } from "../api/postApi/postApi";

const PhoneLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const handleSendOtp = async () => {
        try {
            setLoading(true);
            if (!phoneNumber || phoneNumber.length !== 10) {
                Alert.alert(
                    "Invalid Phone Number",
                    "Please enter a 10-digit valid phone number"
                );
                return;
            }
            const formattedPhoneNumber = `+91${phoneNumber}`;
            console.log("Formatted Phone Number:", formattedPhoneNumber);
            await requestOtp(formattedPhoneNumber);
            router.push(
                `/(auth)/otpVerification?phoneNumber=${encodeURIComponent(formattedPhoneNumber)}`
            );
        } catch (error) {
            console.error("Error sending OTP:", error);
            Alert.alert("Error", "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneNumberChange = (text: string) => {
        const numbersOnly = text.replace(/[^0-9]/g, "");
        setPhoneNumber(numbersOnly);
    };
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
                            <Text style={styles.loginText}>
                                Login Using Phone Number
                            </Text>

                            <TextInput
                                placeholder="Enter Phone Number"
                                style={styles.input}
                                placeholderTextColor={Colors.gray}
                                value={phoneNumber}
                                onChangeText={handlePhoneNumberChange}
                                keyboardType="phone-pad"
                            />

                            <View style={styles.phoneLoginContainer}>
                                <TouchableOpacity onPress={() => router.back()}>
                                    <Text style={styles.phoneLoginText}>
                                        Login with Email Instead
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleSendOtp}
                                disabled={!phoneNumber}
                            >
                                <Text style={styles.continueButtonText}>
                                    {loading ? "Sending OTP..." : "Get OTP"}
                                </Text>
                            </TouchableOpacity>

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

export default PhoneLogin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.background,
    },
    loginHeader: {
        width: Dimensions.get("screen").width,
        backgroundColor: Colors.secondary,
        height: Dimensions.get("screen").height * 0.45,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        position: "relative",
    },
    logoContainer: {
        position: "absolute",
        top: 40,
        right: 20,
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
        paddingTop: 20,
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
        fontSize: 16,
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
        color: "#333333",
        fontSize: 14,
        fontFamily: "nunito",
    },
    contactText: {
        color: Colors.secondary,
        fontSize: 14,
        fontFamily: "nunito-b",
    },
});
