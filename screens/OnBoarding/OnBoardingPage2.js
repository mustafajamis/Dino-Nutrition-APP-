import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const WelcomeHeader = () => {
    return (
        <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Dino</Text>
            <Image
                source={require("../../assets/image/OnBoardingPage2.gif")}
                style={styles.welcomeImage}
                resizeMode="contain"
            />
        </View>
    );
};
const styles = StyleSheet.create({
    welcomeContainer: {
        alignItems: "center",
        marginTop: height * 0.08,
    },
    welcomeTitle: {
        color: "#CFE7CB",
        fontSize: width * 0.07,
        fontWeight: "800",
    },
    welcomeImage: {
        width: width * 0.5,
        height: width * 0.5,
        marginTop: height * 0.05,
    },
});

export default WelcomeHeader;