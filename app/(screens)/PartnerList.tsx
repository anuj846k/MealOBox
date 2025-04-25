import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    Image,
    ActivityIndicator,
} from "react-native";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAllDeliveryPartners } from "../api/getApi/getApi";
import Colors from "@/constants/Colors";

interface Partner {
    _id: string;
    name: string;
    phone: string;
    email: string;
    isActive: boolean;
    assignedSlots: string[];
    createdAt: string;
    updatedAt: string;
}

const PartnerList = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"ACTIVE" | "OFFLINE">("ACTIVE");
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const response = await getAllDeliveryPartners();
            if (response.success) {
                setPartners(response.data);
            } else {
                setError("Failed to fetch partners");
            }
        } catch (err) {
            setError("An error occurred while fetching partners");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchPartners();
        }, [])
    );

    const activePartners = partners.filter((partner) => partner.isActive);
    const offlinePartners = partners.filter((partner) => !partner.isActive);

    const renderPartnerItem = ({ item }: { item: Partner }) => (
        <TouchableOpacity
            style={styles.partnerItem}
            onPress={() =>
                router.push(`/(screens)/PartnerDetails?id=${item._id}`)
            }
        >
            <View style={styles.partnerInfo}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.partnerDetails}>
                    <Text style={styles.partnerName}>{item.name}</Text>
                    <Text style={styles.lastActive}>{item.phone}</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFA500" />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={fetchPartners}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Delivery Partners</Text>
                <View style={{ width: 24 }} />
            </View> 

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "ACTIVE" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("ACTIVE")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "ACTIVE" && styles.activeTabText,
                        ]}
                    >
                        ACTIVE ({activePartners.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "OFFLINE" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("OFFLINE")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "OFFLINE" && styles.activeTabText,
                        ]}
                    >
                        OFFLINE ({offlinePartners.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={activeTab === "ACTIVE" ? activePartners : offlinePartners}
                renderItem={renderPartnerItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.partnerList}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/(screens)/AddDeliveryPartner")}
            >
                <Text style={styles.addButtonText}>ADD DELIVERY PARTNER</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "#FF0000",
        marginBottom: 20,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#FFA500",
        padding: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    headerTitle: {
        fontFamily: "nunito-b",
        fontSize: 19,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    tabContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#FFA500",
    },
    tabText: {
        color: "#888888",
        fontWeight: "500",
    },
    activeTabText: {
        color: "#FFA500",
        fontWeight: "bold",
    },
    partnerList: {
        padding: 16,
    },
    partnerItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    partnerInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFA500",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    partnerDetails: {
        flex: 1,
    },
    partnerName: {
        fontSize: 16,
        fontWeight: "500",
    },
    lastActive: {
        fontSize: 12,
        color: "#888888",
        marginTop: 2,
    },
    addButton: {
        backgroundColor: "#FFA500",
        padding: 16,
        margin: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    addButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    backButton: {
        padding: 16,
    },
});

export default PartnerList;
