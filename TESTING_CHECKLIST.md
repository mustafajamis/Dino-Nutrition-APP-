# Manual Testing Checklist for Simplified Login/Signup

## Pre-Testing Setup
- [ ] Ensure the app builds successfully with `npm install`
- [ ] Start the app in development mode
- [ ] Clear any existing user data for fresh testing

## Signup Flow Testing
### Basic Functionality
- [ ] Navigate to signup screen from welcome/onboarding
- [ ] Verify signup form only shows 3 fields: Name, Email, Password
- [ ] Verify no complex profile creation screen appears
- [ ] Test input validation:
  - [ ] Empty fields show appropriate error message
  - [ ] Password less than 6 characters shows error
  - [ ] Valid inputs allow form submission

### User Experience
- [ ] Verify smooth fade-in animation when screen loads
- [ ] Test input field focus states and visual feedback
- [ ] Confirm button has loading state when submitting
- [ ] Check success message is welcoming and friendly
- [ ] Verify user goes directly to main app after successful signup

### Edge Cases
- [ ] Test duplicate email registration (should show error)
- [ ] Test form submission while loading (button should be disabled)
- [ ] Test keyboard dismissal by tapping outside inputs

## Login Flow Testing
### Basic Functionality
- [ ] Navigate to login screen
- [ ] Verify login form shows only Email and Password fields
- [ ] Test successful login with valid credentials
- [ ] Test failed login with invalid credentials

### User Experience
- [ ] Verify smooth fade-in animation when screen loads
- [ ] Test password visibility toggle functionality
- [ ] Confirm button has loading state when submitting
- [ ] Verify user goes directly to main app after successful login

## Navigation Testing
- [ ] Test navigation between Login and Signup screens
- [ ] Verify CreateProfile screen is completely bypassed
- [ ] Confirm Main app loads correctly after authentication
- [ ] Test back navigation from signup/login screens

## Visual Design Testing
- [ ] Verify modern input styling with shadows and rounded corners
- [ ] Check button styling with shadows and proper spacing
- [ ] Confirm consistent green color scheme (#91C788)
- [ ] Test responsive design on different screen sizes
- [ ] Verify all animations are smooth and not jarring

## Accessibility Testing
- [ ] Test with screen reader (if available)
- [ ] Verify proper accessibility labels on inputs
- [ ] Check keyboard navigation works properly
- [ ] Confirm sufficient color contrast

## Performance Testing
- [ ] Monitor app responsiveness during animations
- [ ] Check memory usage doesn't spike during signup/login
- [ ] Verify no unnecessary re-renders or performance issues

## Cross-Platform Testing (if applicable)
- [ ] Test on iOS device/simulator
- [ ] Test on Android device/emulator
- [ ] Verify consistent behavior across platforms

## Data Persistence Testing
- [ ] Verify user data is properly saved after signup
- [ ] Test login persistence across app restarts
- [ ] Confirm logout functionality works correctly

## Error Handling Testing
- [ ] Test network connectivity issues during signup/login
- [ ] Verify graceful error messages for various failure scenarios
- [ ] Test app recovery after errors

## Notes
- The app now skips the complex profile creation step
- Users can start using the app immediately after signup
- All profile-related fields (age, gender, phone, picture) are optional in the database
- The Country Picker dependency has been removed to eliminate conflicts