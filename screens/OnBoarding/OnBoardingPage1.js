import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";



const WelcomeHeader = () => {
  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeTitle}>Dino</Text>
      <Image
        source={require('../../assets/image/OnBoardingPage1.gif')}
        style={styles.welcomeImage}
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
      <View style={styles.activeDot} />
      <View style={styles.inactiveDot} />
    </View>
  );
};

const ActionButtons = () => {
  return (
    <View style={styles.actionContainer}>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Welcome Header Styles
  welcomeContainer: {
    alignItems: "center",
  },
  welcomeTitle: {
    color: "#CFE7CB",
    fontFamily: "Nunito",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 66,
  },
  welcomeImage: {
    width: 190,
    height: 190,
    marginTop: 93,
  },
  // Content Section Styles
  contentContainer: {
    alignItems: "center",
    marginTop: 43,
  },
  contentTitle: {
    color: "rgba(0,0,0,0.85)",
    fontFamily: "Signika",
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 8,
  },
  contentDescription: {
    color: "rgba(0,0,0,0.45)",
    fontFamily: "Signika",
    fontSize: 17,
    fontWeight: "400",
    maxWidth: 272,
    textAlign: "center",
  },
  // Progress Indicator Styles
  progressContainer: {
    flexDirection: "row",
    gap: 5,
    marginTop: 11,
  },
  activeDot: {
    height: 11,
    width: 22,
    left: 150,
    borderRadius: 16,
    backgroundColor: "#FF8473",
  },
  inactiveDot: {
    height: 11,
    width: 13,
    left: 150,
    borderRadius: 16,
    backgroundColor: "#FFC0B8",
  },
  // Action Buttons Styles
  actionContainer: {
    marginTop: 43,
    alignItems: "center",
    gap: 15,
  },
  actionButton: {
    width: 290,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#91C788",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "Signika",
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: 1.25,
  },
  loginContainer: {
    flexDirection: "row",
  },
  loginText: {
    color: "#7C7C7C",
    fontFamily: "Signika",
    fontSize: 17,
    fontWeight: "400",
  },
  loginLink: {
    color: "#91C788",
    fontFamily: "Signika",
    fontSize: 17,
    fontWeight: "700",
  },
});

export default InputDesign;
