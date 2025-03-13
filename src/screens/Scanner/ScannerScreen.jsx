import React, { useState, createRef, useEffect } from 'react';
import { View, Button, StyleSheet, Text, Image ,TouchableOpacity} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { requestPermission } from '../../utils/PermissionHelper';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'react-native-fs';

const ScannerScreen = ({ navigation }) => {
  const [photoUri, setPhotoUri] = useState(null);
  const [isModelReady, setIsModelReady] = useState(false);
  let cameraRef = createRef();
  
  useEffect(() => {
    setupTensorFlow();
    requestPermission();
  }, []);

  const setupTensorFlow = async () => {
    try {
      await tf.ready();
      await tf.setBackend('webgl');
      setIsModelReady(true);
      console.log('TensorFlow.js is ready');
    } catch (error) {
      console.error('Failed to setup TensorFlow:', error);
    }
  };

  const loadImage = async (uri) => {
    try {
      const response = await FileSystem.readFile(uri, 'base64');
      const imageData = Buffer.from(response, 'base64');
      const tensor = decodeJpeg(imageData);
      return tensor;
    } catch (error) {
      console.error('Error loading image:', error);
      throw error;
    }
  };

  const handleCapture = async () => {
    if (device) {
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
        });
        detectFace(photo);
      } catch (error) {
        console.error('Failed to capture photo', error);
      }
    }
  };

  const detectFace = async (imageUri) => {  
    if (!isModelReady) {
      console.log('TensorFlow.js is not ready yet');
      return;
    }

    try {
      console.log('Detecting face...', imageUri);
      
      const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
      );
      console.log('Face detection model loaded');

      const imageTensor = await loadImage(imageUri);
      console.log('Image loaded as tensor');

      const predictions = await model.estimateFaces({
        input: imageTensor,
      });

      console.log('Detection complete:', predictions);
      
      tf.dispose(imageTensor);

      if (predictions.length > 0) {
        console.log('Detected faces:', predictions);
      } else {
        console.log('No faces detected');
      }
    } catch (error) {
      console.error('Error in face detection:', error);
    }
  };

  const device = useCameraDevice('front')

  if (device == null) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        onError={(error) => {console.log('Camera error:', error)}}
        ref={cameraRef}
      />

      <TouchableOpacity 
        style={styles.captureButton}
        onPress={handleCapture}
      >
        <Text style={styles.captureButtonText}>Capture Photo</Text>
      </TouchableOpacity>

      {photoUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: photoUri }} style={styles.image} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  camera: {
    width: '100%',
    height: '70%',
  },
  imageContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    borderWidth: 1,
    borderColor: 'white',
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  image: {
    width: 100,
    height: 100,
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
});

export default ScannerScreen; 