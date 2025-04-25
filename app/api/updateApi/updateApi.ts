const url = process.env.API_URL;

export const toggleKitchenStatus = async (kitchenPartnerId: string) => {
    try {
        const response = await fetch(
            `${url}/admin/toggle-status/${kitchenPartnerId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Request failed with status ${response.status}: ${errorText}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error toggling kitchen status:", error);
        throw error;
    }
};

export const togglePartnerStatus = async (partnerId: string) => {
    try {
        const response = await fetch(
            `${url}/admin/toggle-delivery-partner-status/${partnerId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Request failed with status ${response.status}: ${errorText}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error toggling delivery partner status:", error);
        throw error;
    }
};

export const updatePartnerDetails = async (partnerId: string, formData: FormData) => {
    try {
        // Debug log
        console.log('Sending update request for partner:', partnerId);
        
        const response = await fetch(`${url}/admin/update-delivery-partner/${partnerId}`, {
            method: "PUT",
            headers: {
                Accept: 'application/json',
                // Remove Content-Type header - let browser set it with boundary
            },
            body: formData,
        });

        // Debug log
        console.log('Response status:', response.status);

        const data = await response.json();
        
        // Debug log
        console.log('Response data:', data);

        if (!response.ok) {
            throw new Error(
                data.message || `Request failed with status ${response.status}`
            );
        }

        return data;
    } catch (error) {
        console.error("Error updating partner details:", error);
        throw error;
    }
};

export const updateManager = async (managerId: string, managerData: {
    name?: string;
    phone?: string;
    email?: string;
    dateOfBirth?: string;
    gender?: string;
    branch?: string;
    isActive?: boolean;
}) => {
    try {
        const response = await fetch(`${url}/admin/managers/${managerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(managerData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating manager:", error);
        throw error;
    }
};

export const deleteManager = async (managerId: string) => {
    try {
        const response = await fetch(`${url}/admin/managers/${managerId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting manager:", error);
        throw error;
    }
};

