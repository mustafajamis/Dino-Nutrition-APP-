import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

export const responsiveStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  greenWave: {
    position: 'absolute',
    top: 0,
  },
  formContainer: {
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.2,
  },
  title: {
    fontSize: width * 0.08,
    color: '#91C788',
    fontWeight: 'bold',
    marginBottom: height * 0.04,
    alignSelf: 'center',
  },
  cotitle: {
    fontSize: width * 0.1,
    color: '#91C788',
    fontWeight: 'bold',
    marginBottom: height * 0.06,
    alignSelf: 'center',
  },
  label: {
    fontSize: width * 0.038,
    marginBottom: height * 0.012,
    marginLeft: width * 0.01,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.025,
  },
  input: {
    flex: 1,
    height: height * 0.065,
  },
  inputIcon: {
    marginLeft: width * 0.02,
    fontSize: width * 0.045,
  },
  primaryButton: {
    backgroundColor: '#91C788',
    borderRadius: 10,
    paddingVertical: height * 0.018,
    alignItems: 'center',
    marginTop: height * 0.015,
  },
  loginButton: {
    backgroundColor: '#91C788',
    borderRadius: 10,
    paddingVertical: height * 0.018,
    alignItems: 'center',
    marginTop: height * 0.015,
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.045,
  },
  signupButton: {
    backgroundColor: '#91C788',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.025,
  },
  footerText: {
    color: '#555',
    fontSize: width * 0.035,
  },
  link: {
    color: '#91C788',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  contentTitle: {
    color: 'rgba(0,0,0,0.85)',
    fontFamily: 'Signika',
    fontSize: width * 0.06,
    fontWeight: '600',
    marginBottom: height * 0.01,
  },
  contentDescription: {
    color: 'rgba(0,0,0,0.45)',
    fontFamily: 'Signika',
    fontSize: width * 0.045,
    fontWeight: '400',
    maxWidth: width * 0.8,
    textAlign: 'center',
  },
  actionButton: {
    width: width * 0.8,
    height: height * 0.08,
    borderRadius: 24,
    backgroundColor: '#91C788',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontFamily: 'Signika',
    fontSize: width * 0.055,
    fontWeight: '600',
    letterSpacing: 1.25,
  },
});
