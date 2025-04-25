import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";

export default function RootLayout() {
    const [loaded, error] = useFonts({
        nunito: require("@/assets/fonts/Nunito-Regular.ttf"),
        "nunito-sb": require("@/assets/fonts/Nunito-SemiBold.ttf"),
        "nunito-b": require("@/assets/fonts/Nunito-Bold.ttf"),
    });
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
    );
}
