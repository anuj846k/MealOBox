import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { requestOtp, verifyOtpLogin } from "../api/postApi/postApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OtpVerification = () => {
    const { phoneNumber: encodedPhoneNumber } = useLocalSearchParams();
    const phoneNumber = decodeURIComponent(encodedPhoneNumber as string);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timer, setTimer] = useState(20);
    const router = useRouter();
    const inputRefs = useRef<Array<any>>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleOtpChange = (value: string, index: number) => {
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to next input if value is entered
            if (value !== "" && index < 3) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Move to previous input on backspace if current input is empty
        if (
            e.nativeEvent.key === "Backspace" &&
            index > 0 &&
            otp[index] === ""
        ) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleResendOtp = async () => {
        try {
            await requestOtp(phoneNumber as string);
            setTimer(20);
        } catch (error) {
            console.error("Error resending OTP:", error);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const otpString = otp.join("");
            if (otpString.length !== 4) {
                console.error("Please enter complete OTP");
                return;
            }

            console.log("Verifying OTP:", {
                phoneNumber,
                otpString,
            });

            const response = await verifyOtpLogin(
                phoneNumber as string,
                otpString
            );

            console.log("Verification Response:", response);

            if (response.token) {
                await AsyncStorage.setItem("accessToken", response.token);
                await AsyncStorage.setItem("data", JSON.stringify(response));
            }
            // if (response.kitchenPartner) {
            //     await AsyncStorage.setItem(
            //         "kitchenPartnerId",
            //         response.kitchenPartner.id
            //     );
            // }
            router.replace("/(tabs)");
        } catch (error) {
            console.error("Error verifying OTP:", error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <SafeAreaView style={styles.container}>
                <Stack.Screen
                    options={{
                        headerTitle: "",
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: Colors.background,
                        },
                    }}
                />

                <View style={styles.content}>
                    <Text style={styles.title}>Enter OTP</Text>
                    <Text style={styles.subtitle}>
                        A 4 digit OTP has been sent to{"\n"}
                        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                    </Text>

                    <View style={styles.otpContainer}>
                        {[0, 1, 2, 3].map((index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={styles.otpInput}
                                maxLength={1}
                                keyboardType="number-pad"
                                value={otp[index]}
                                onChangeText={(value) =>
                                    handleOtpChange(value, index)
                                }
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleVerifyOtp}
                    >
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>

                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>
                            Didn't receive OTP?{" "}
                        </Text>
                        {timer > 0 ? (
                            <Text style={styles.timerText}>
                                Resend in {timer}s
                            </Text>
                        ) : (
                            <TouchableOpacity onPress={handleResendOtp}>
                                <Text style={styles.resendButton}>Resend</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>
                            Back to Login Options
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default OtpVerification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: "center",
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        fontFamily: "nunito-b",
        color: "#000000",
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "nunito",
        color: Colors.gray,
        textAlign: "center",
        marginBottom: 32,
    },
    phoneNumber: {
        color: Colors.secondary,
        fontFamily: "nunito-b",
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
        marginBottom: 32,
    },
    otpInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: Colors.secondary,
        borderRadius: 8,
        textAlign: "center",
        fontSize: 24,
        fontFamily: "nunito-b",
    },
    continueButton: {
        width: "100%",
        height: 50,
        backgroundColor: Colors.secondary,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    continueButtonText: {
        color: Colors.background,
        fontSize: 16,
        fontFamily: "nunito-b",
    },
    resendContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    resendText: {
        fontSize: 14,
        fontFamily: "nunito",
        color: Colors.gray,
    },
    timerText: {
        fontSize: 14,
        fontFamily: "nunito",
        color: Colors.gray,
    },
    resendButton: {
        fontSize: 14,
        fontFamily: "nunito-b",
        color: Colors.secondary,
    },
    backButton: {
        position: "absolute",
        bottom: 40,
    },
    backButtonText: {
        fontSize: 14,
        fontFamily: "nunito",
        color: Colors.secondary,
    },
});
