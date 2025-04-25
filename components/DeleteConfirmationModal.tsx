import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";

interface DeleteConfirmationModalProps {
    visible: boolean;
    itemName: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmationModal({
    visible,
    itemName,
    onCancel,
    onConfirm,
}: DeleteConfirmationModalProps) {
    return (
        <Modal transparent={true} visible={visible} animationType="fade">
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Confirm Item Deletion</Text>

                    <Text style={styles.modalMessage}>
                        Are you sure you want to delete {itemName} from the
                        list?
                    </Text>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={onConfirm}
                        >
                            <Text style={styles.deleteButtonText}>
                                Delete Item
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 8,
        overflow: "hidden",
    },
    modalTitle: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
        color: "#333333",
        paddingVertical: 16,
        backgroundColor: "#FFF9E6",
        borderBottomWidth: 1,
        borderBottomColor: "#FFE082",
    },
    modalMessage: {
        fontSize: 16,
        color: "#333333",
        textAlign: "center",
        marginVertical: 24,
        paddingHorizontal: 16,
    },
    buttonsContainer: {
        flexDirection: "row",
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#EEEEEE",
        paddingVertical: 12,
        borderRadius: 4,
        marginRight: 8,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#333333",
        fontWeight: "500",
    },
    deleteButton: {
        flex: 1,
        backgroundColor: "#FF5252",
        paddingVertical: 12,
        borderRadius: 4,
        marginLeft: 8,
        alignItems: "center",
    },
    deleteButtonText: {
        color: "#FFFFFF",
        fontWeight: "500",
    },
});
