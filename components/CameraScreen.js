import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import { Camera } from "expo-camera";
import { Capture, Submit, Back, Reset } from "../assets";

const CameraScreen = ({
  cancelCamera,
  submitImage,
  setImageUrl,
  capturedImage,
  setCapturedImage,
  setSelectedImage,
  permission,
  type,
}) => {
  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setCapturedImage(photo);
      setImageUrl(photo.uri);
      setSelectedImage(photo.uri);
    }
  };

  const resetImage = () => {
    setCapturedImage(null);
    setImageUrl(null);
    setSelectedImage(null);
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="camera-screen">
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => (cameraRef = ref)}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={takePicture}
            testID="capture-button"
          >
            <Image
              source={Capture}
              style={styles.imageIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={cancelCamera}>
            <Image
              source={Back}
              style={styles.imageIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {capturedImage && (
            <TouchableOpacity style={styles.button} onPress={resetImage}>
              <Image
                source={Reset}
                style={styles.imageIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {capturedImage && (
            <TouchableOpacity style={styles.button} onPress={submitImage}>
              <Image
                source={Submit}
                style={styles.imageIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </Camera>

      {capturedImage && (
        <View style={styles.imagePreviewContainer}>
          <Text style={{ textAlign: "center", marginBottom: 15 }}>
            Captured Image Preview
          </Text>
          <Image
            source={{ uri: capturedImage.uri }}
            style={styles.imagePreview}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 20,
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  imageIcon: {
    width: 30,
    height: 30,
  },
});

export default CameraScreen;
