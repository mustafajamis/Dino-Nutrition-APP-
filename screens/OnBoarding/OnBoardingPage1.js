import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

// Get device screen dimensions
const { width, height } = Dimensions.get("window");

const WelcomeHeader = () => {
  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeTitle}>Dino</Text>
      <Image
        source={require("../../assets/image/OnBoardingPage1.gif")}
        style={styles.welcomeImage}
        resizeMode="contain"
      />
    </View>
  );
};

const ContentSection = () => {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.contentTitle}>Eat Healthy</Text>
      <Text style={styles.contentDescription}>
        Maintaining good health should be the primary focus of everyone.
      </Text>
    </View>
  );
};

const ProgressIndicator = () => {
  return (
    <View style={styles.progressContainer}>
      {/* Active page dot */}
      <View style={styles.activeDot} />
      {/* Inactive page dot */}
      <View style={styles.inactiveDot} />
    </View>
  );
};

const ActionButtons = () => {
  return (
    <View style={styles.actionContainer}>
      {/* CTA button */}
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      {/* Redirect to login section */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already Have An Account? </Text>
        <Text style={styles.loginLink}>Log In</Text>
      </View>
    </View>
  );
};

const InputDesign = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <WelcomeHeader />
        <ContentSection />
        <ProgressIndicator />
        <ActionButtons />
      </View>
    </View>
  );
};

// Styles using responsive layout techniques
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05, // 5% of screen width padding
  },

  // Header section with title and image
  welcomeContainer: {
    alignItems: "center",
    marginTop: height * 0.08, // 8% vertical margin from top
  },
  welcomeTitle: {
    color: "#CFE7CB",
    fontFamily: "Nunito",
    fontSize: width * 0.07, // Dynamic font size based on screen width
    fontWeight: "800",
  },
  welcomeImage: {
    width: width * 0.5,
    height: width * 0.5,
    marginTop: height * 0.08,
  },

  // Middle content area
  contentContainer: {
    alignItems: "center",
    marginTop: height * 0.05,
  },
  contentTitle: {
    color: "rgba(0,0,0,0.85)",
    fontFamily: "Signika",
    fontSize: width * 0.06,
    fontWeight: "600",
    marginBottom: 8,
  },
  contentDescription: {
    color: "rgba(0,0,0,0.45)",
    fontFamily: "Signika",
    fontSize: width * 0.045,
    fontWeight: "400",
    maxWidth: width * 0.8,
    textAlign: "center",
  },

  // Progress indicator section
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: height * 0.02,
  },
  activeDot: {
    height: 11,
    width: 22,
    borderRadius: 16,
    backgroundColor: "#FF8473",
    marginHorizontal: 3,
  },
  inactiveDot: {
    height: 11,
    width: 13,
    borderRadius: 16,
    backgroundColor: "#FFC0B8",
    marginHorizontal: 3,
  },

  // Bottom call-to-action and login
  actionContainer: {
    marginTop: height * 0.06,
    alignItems: "center",
    gap: 15,
  },
  actionButton: {
    width: width * 0.8, // 80% of screen width
    height: height * 0.08,
    borderRadius: 24,
    backgroundColor: "#91C788",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "Signika",
    fontSize: width * 0.055,
    fontWeight: "600",
    letterSpacing: 1.25,
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  loginText: {
    color: "#7C7C7C",
    fontFamily: "Signika",
    fontSize: width * 0.04,
    fontWeight: "400",
  },
  loginLink: {
    color: "#91C788",
    fontFamily: "Signika",
    fontSize: width * 0.04,
    fontWeight: "700",
  },
});

export default InputDesign;
