import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface SkeletonLoaderProps {
  children: React.ReactNode;
}

const SkeletonLoader = ({ children }: SkeletonLoaderProps) => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  // Animation effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            style: [
              child.props.style,
              styles.skeletonBox,
              { opacity: fadeAnim }
            ]
          });
        }
        return child;
      })}
    </View>
  );
};

// Skeleton item component for individual skeleton elements
export const SkeletonItem = ({ style }: { style: any }) => {
  return <Animated.View style={style} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skeletonBox: {
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
  },
});

export default SkeletonLoader;