const url = process.env.API_URL;

const fetchMealByKitchenPartnerId = async (id: string) => {
    const response = await fetch(`${url}/admin/get-meal/${id}`);
    const data = await response.json();
    return data;
};

const fetchMeals = async (id: string) => {
    const response = await fetch(`${url}/admin/get-meal/${id}`);
    const data = await response.json();
    return data;
};

const fetchMyMeals = async (id: string) => {
    const response = await fetch(`${url}/kitchen-partner/get-my-meals/${id}`);
    const data = await response.json();
    console.log("My meals", data);
    return data;
};

const fetchSlotsOrders = async (slotId: string) => {
    try {
        const response = await fetch(`${url}/admin/slot/${slotId}/summary`);
        const result = await response.json();
        console.log("Result", result);
        if (!result.success) {
            throw new Error(result.message);
        }
        return result.data;
    } catch (error) {
        console.error("Error fetching slot details:", error);
        throw error;
    }
};

const fetchSlotDetails = async (slotId: string) => {
    try {
        const response = await fetch(`${url}/admin/slot/${slotId}/details`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch orders");
        }

        if (!result.success) {
            throw new Error(result.message || "Failed to fetch orders");
        }

        return {
            success: result.success,
            totalOrders: result.totalOrders || 0,
            ordersByArea: result.ordersByArea || [],
        };
    } catch (error) {
        console.error("Error fetching slot orders:", error);
        return {
            success: true,
            totalOrders: 0,
            ordersByArea: [],
        };
    }
};

const getAllDeliveryPartners = async () => {
    try {
        const response = await fetch(`${url}/admin/get-all-delivery-partners`);
        return response.json();
    } catch (error) {
        throw error;
    }
};

const getManagers = async () => {
    try {
        const response = await fetch(`${url}/admin/managers`);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};

const getManagerById = async (id: string) => {
    try {
        const response = await fetch(`${url}/admin/managers/${id}`);
        const result = await response.json();
        return result;  
    } catch (error) {
        throw error;
    }
};


export {
    fetchMealByKitchenPartnerId,
    fetchMeals,
    fetchMyMeals,
    fetchSlotDetails,
    fetchSlotsOrders,
    getAllDeliveryPartners,
    getManagers,
    getManagerById,
};
