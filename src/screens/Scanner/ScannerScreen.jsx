import { 
  StyleSheet, 
  Text, 
  View 
} from 'react-native'
import { 
  useEffect, 
  useState,
  useRef
} from 'react'
import {
  Camera,
  useCameraDevice,
  useFrameProcessor
} from 'react-native-vision-camera'
import { 
  Face,
  runAsync,
  useFaceDetector,
  FaceDetectionOptions
} from 'react-native-vision-camera-face-detector'
import { Worklets } from 'react-native-worklets-core'

export default function App() {
  const [faces, setFaces] = useState([]); // Store detected faces

  const faceDetectionOptions = useRef( {
    //mode: FaceDetectionOptions.Mode.Accurate, // detection mode
    landmarkMode: 'all', // landmark mode
    classificationMode: 'all', // classification mode
    performanceMode: 'normal', // performance mode
    contourMode: 'all', // contour mode
    // detection options
  } ).current

  const device = useCameraDevice('front')
  const { detectFaces } = useFaceDetector( faceDetectionOptions )

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission()
      console.log({ status })
    })()
  }, [device])

  const handleDetectedFaces = Worklets.createRunOnJS( (
    faces
  ) => { 
    console.log( 'faces detected', faces )
    setFaces(faces);
  })

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    //runAsync(frame, () => {
      //'worklet'
      const faces = detectFaces(frame)
      // ... chain some asynchronous frame processor
      // ... do something asynchronously with frame
      handleDetectedFaces(faces)
    //})
    // ... chain frame processors
    // ... do something with frame
  }, [handleDetectedFaces])

  const renderBoundingBoxes = () => {
    return faces.map((face, index) => {
      const { bounds } = face; // Get the bounds of each detected face
      const { origin, size } = bounds;
      const { x, y } = origin;
      const { width, height } = size;

      return (
        <View
          key={index}
          style={[
            styles.boundingBox,
            {
              left: x,
              top: y,
              width: width,
              height: height,
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {!!device? 
      <View>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
       {renderBoundingBoxes()}
      </View>
       : <Text>
        No Device
      </Text>}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute', // Ensure camera is in the background
  },
  boundingBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 5,
  },
  text: {
    position: 'absolute',
    top: 50,
    fontSize: 18,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
  },
});
