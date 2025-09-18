import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import {recognizeFood, logMeal} from '../../services/foodRecognitionAPI';
import {formatCalories, formatNutrient} from '../../utils/formatCalories';

const FoodScannerScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const handleTakePhoto = async () => {
    try {
      setIsScanning(true);
      
      // Mock image capture - in real app this would use react-native-image-picker
      const mockImageUri = 'mock-image-uri.jpg';
      
      Alert.alert(
        'Photo Capture',
        'In a real app, this would open the camera to take a photo',
        [
          {text: 'Cancel', style: 'cancel', onPress: () => setIsScanning(false)},
          {
            text: 'Simulate Photo',
            onPress: () => simulatePhotoCapture(mockImageUri),
          },
        ],
      );
    } catch (error) {
      console.error('Error taking photo:', error);
      setIsScanning(false);
    }
  };

  const simulatePhotoCapture = async (imageUri) => {
    try {
      const result = await recognizeFood(imageUri);
      
      if (result.success) {
        setRecognitionResult(result.data);
        setShowResultModal(true);
      } else {
        Alert.alert('Recognition Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze food. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleLogFood = async () => {
    if (!recognitionResult) return;

    try {
      const mealData = {
        ...recognitionResult,
        loggedAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
      };

      const result = await logMeal(mealData);
      
      if (result.success) {
        Alert.alert('Success', 'Food logged successfully!');
        setShowResultModal(false);
        setRecognitionResult(null);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to log food. Please try again.');
    }
  };

  const handleRetake = () => {
    setShowResultModal(false);
    setRecognitionResult(null);
    handleTakePhoto();
  };

  const ScannerInterface = () => (
    <View style={styles.scannerContainer}>
      {/* Camera Viewfinder Simulation */}
      <View style={styles.viewfinder}>
        <View style={styles.scanOverlay}>
          <View style={styles.scanCorners}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.scanInstructions}>
            Point your camera at food to analyze its nutritional content
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.captureButton, isScanning && styles.capturingButton]}
          onPress={handleTakePhoto}
          disabled={isScanning}>
          {isScanning ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <View style={styles.captureButtonInner}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Tips */}
      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>Tips for better recognition:</Text>
        <Text style={styles.tipText}>• Good lighting</Text>
        <Text style={styles.tipText}>• Clear view of the food</Text>
        <Text style={styles.tipText}>• Single food item works best</Text>
      </View>
    </View>
  );

  const ResultModal = () => (
    <Modal
      visible={showResultModal}
      animationType="slide"
      presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowResultModal(false)}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Food Recognition</Text>
          <TouchableOpacity onPress={handleLogFood}>
            <Text style={styles.modalSaveText}>Log Food</Text>
          </TouchableOpacity>
        </View>

        {recognitionResult && (
          <ScrollView style={styles.modalContent}>
            {/* Food Information */}
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.foodName}>{recognitionResult.name}</Text>
                <Text style={styles.confidenceText}>
                  {Math.round(recognitionResult.confidence * 100)}% confident
                </Text>
              </View>

              <View style={styles.portionInfo}>
                <Text style={styles.portionText}>
                  Portion: {recognitionResult.portion.toFixed(1)}x standard serving
                </Text>
              </View>
            </View>

            {/* Nutrition Information */}
            <View style={styles.nutritionCard}>
              <Text style={styles.nutritionTitle}>Nutritional Information</Text>
              
              <View style={styles.calorieSection}>
                <Text style={styles.calorieValue}>
                  {formatCalories(Math.round(recognitionResult.calories * recognitionResult.portion))}
                </Text>
                <Text style={styles.calorieLabel}>Total Calories</Text>
              </View>

              <View style={styles.macroGrid}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {formatNutrient(recognitionResult.protein * recognitionResult.portion)}
                  </Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {formatNutrient(recognitionResult.carbs * recognitionResult.portion)}
                  </Text>
                  <Text style={styles.macroLabel}>Carbs</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {formatNutrient(recognitionResult.fat * recognitionResult.portion)}
                  </Text>
                  <Text style={styles.macroLabel}>Fat</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {formatNutrient(recognitionResult.fiber * recognitionResult.portion)}
                  </Text>
                  <Text style={styles.macroLabel}>Fiber</Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsSection}>
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
                <Text style={styles.retakeButtonText}>📷 Retake Photo</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Scanner</Text>
        <Text style={styles.headerSubtitle}>
          Take a photo to analyze nutrition
        </Text>
      </View>

      <ScannerInterface />
      <ResultModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 4,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  viewfinder: {
    flex: 1,
    margin: 20,
    position: 'relative',
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  scanCorners: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#91C788',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanInstructions: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 40,
    fontWeight: '500',
  },
  controls: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#91C788',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  capturingButton: {
    backgroundColor: '#ccc',
  },
  captureButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 32,
  },
  tips: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  tipsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  modalCancelText: {
    color: '#666',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSaveText: {
    color: '#91C788',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 14,
    color: '#91C788',
    backgroundColor: '#f0f8f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  portionInfo: {
    alignItems: 'center',
  },
  portionText: {
    fontSize: 16,
    color: '#666',
  },
  nutritionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  calorieSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  calorieValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#91C788',
  },
  calorieLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  macroItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionsSection: {
    marginBottom: 20,
  },
  retakeButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  retakeButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});

export default FoodScannerScreen;
