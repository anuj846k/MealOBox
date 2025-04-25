import { formDataProps } from "@/app/interfaces/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";

const url = process.env.API_URL;

// login
const loginKitchenPartner = async (formData: formDataProps) => {
    const response = await fetch(`${url}/admin/login-kitchen-partner`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
};

const requestOtp = async (phoneNumber: string) => {
    const response = await fetch(`${url}/auth/request-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Request failed with status ${response.status}: ${errorText}`
        );
    }

    return response.json();
};

const verifyOtpLogin = async (phoneNumber: string, otp: string) => {
    const response = await fetch(`${url}/auth/verify-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, otp }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json(); // returns { token, kitchenPartner, message }
};

const addNewItems = async (item: string) => {
    try {
        const kitchenPartnerId = await AsyncStorage.getItem("kitchenPartnerId");
        if (!kitchenPartnerId) {
            throw new Error("kitchenPartnerId not found in AsyncStorage");
        }

        const response = await fetch(`${url}/admin/create-meal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ item, kitchenPartnerId }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error in addNewItems:", error);
        throw error;
    }
};

const addMyMeals = async (item: string) => {
    try {
        const kitchenPartnerId = await AsyncStorage.getItem("kitchenPartnerId");
        if (!kitchenPartnerId) {
            throw new Error("kitchenPartnerId not found in AsyncStorage");
        }

        const response = await fetch(`${url}/kitchen-partner/create-my-meal}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ item, kitchenPartnerId }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error in addMyMeals:", error);
        throw error;
    }
};

const createDeliveryPartner = async (formData: FormData) => {
    try {
        const response = await fetch(`${url}/admin/create-delivery-partner`, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Request failed with status ${response.status}: ${errorText}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating delivery partner:", error);
        throw error;
    }
};

const AssignSlot = async (partnerId: string, slotId: string) => {
    try {
        const response = await fetch(`${url}/admin/${partnerId}/slots`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ slotId, partnerId }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error in AssignSlot:", error);
        throw error;
    }
};

const createManager = async (managerData: {
    name: string;
    phone: string;
    email: string;
    dateOfBirth?: string;
    gender?: string;
    branch: string;
}) => {
    try {
        const response = await fetch(`${url}/admin/managers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(managerData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error creating manager:", error);
        throw error;
    }
};

export {
    loginKitchenPartner,
    addNewItems,
    addMyMeals,
    requestOtp,
    verifyOtpLogin,
    createDeliveryPartner,
    AssignSlot,
    createManager,
};
