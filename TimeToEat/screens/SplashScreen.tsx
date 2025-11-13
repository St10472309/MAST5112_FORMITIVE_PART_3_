import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/J_background.jpg")} style={styles.image} />
      <View style={styles.overlay}>
        <Image source={require("../assets/J_logo.jpg")} style={styles.logo} />
        <Text style={styles.title}>Tasty Bites</Text>
        <Text style={styles.subtitle}>Restaurant Menu Manager</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c3e50",
  },
  image: {
    width: "100%",
    height: "100%",
    opacity: 0.7,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(44, 62, 80, 0.8)",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    opacity: 0.9,
  },
});

export default SplashScreen;
