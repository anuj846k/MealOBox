import { useState } from "react";
import { useRouter } from "expo-router";
import SplashScreen from "./(screens)/splash/SplashScreen";

export default function Index() {
    const [showSplash, setShowSplash] = useState(true);
    const router = useRouter();

    const handleAnimationComplete = () => {
        setShowSplash(false);
        router.replace("/login");
    };

    if (showSplash) {
        return <SplashScreen onAnimationComplete={handleAnimationComplete} />;
    }

    return null;
}
