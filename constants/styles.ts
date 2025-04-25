import { StyleSheet } from "react-native";
import Colors from "./Colors";

export const defaultStyles = StyleSheet.create({
    inputField: {
        height: 44,
        borderWidth: 1,
        borderColor: Colors.secondary,
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#fff",
        minWidth: "100%",
    },
});
