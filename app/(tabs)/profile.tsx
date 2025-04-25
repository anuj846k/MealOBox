import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Alert,
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import ProfileHeader from "@/components/profileComponents/ProfileHeader";
import ProfileList from "@/components/profileComponents/ProfileList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const profile = () => {
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = async () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        try {
            await AsyncStorage.clear();
            console.log("AsyncStorage cleared successfully");
            setShowLogoutModal(false);
            router.push("/(auth)/login");
        } catch (error) {
            console.error("Failed to clear AsyncStorage:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                    headerStyle: { backgroundColor: "transparent" },
                    headerTransparent: true,
                }}
            />
            <SafeAreaView style={styles.safeAreaView}>
                <View style={{ paddingHorizontal: 12 }}>
                    <ProfileHeader />
                </View>

                <View style={{ paddingHorizontal: 12 }}>
                    <ProfileList />
                </View>

                <View style={styles.logoutButtonContainer}>
                    <TouchableOpacity 
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Logout Confirmation Modal */}
            <Modal
                visible={showLogoutModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.warningIconContainer}>
                            <Ionicons name="warning-outline" size={40} color="#FFC107" />
                        </View>
                        <Text style={styles.modalTitle}>Confirm Logout</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to logout from your account?
                        </Text>
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={confirmLogout}
                            >
                                <Text style={styles.confirmButtonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    safeAreaView: {
        backgroundColor: Colors.background,
        flex: 1,
    },
    logoutButtonContainer: {
        paddingHorizontal: 12,
        marginTop: 'auto',
        paddingBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#FF5252',
        borderRadius: 8,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logoutText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        width: '80%',
        alignItems: 'center',
    },
    warningIconContainer: {
        backgroundColor: '#FFF8E1',
        borderRadius: 50,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333333',
    },
    modalMessage: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 6,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
    },
    confirmButton: {
        backgroundColor: '#FF5252',
    },
    cancelButtonText: {
        color: '#333333',
        fontWeight: '600',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
