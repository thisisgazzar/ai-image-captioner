import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import * as SplashScreen from "expo-splash-screen";
import CameraScreen from "./CameraScreen";
import { Preview } from "../assets";

SplashScreen.preventAutoHideAsync();

const ImageForm = ({ onSubmit, caption }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [toggleCamera, setToggleCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [type, setType] = useState(CameraType.back);

  const [fontsLoaded, fontError] = useFonts({
    "BebasNeue-Regular": require("../assets/fonts/BebasNeue-Regular.ttf"),
  });

  useEffect(() => {
    // Request permission to access the photo library
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "You need to grant permission to access the photo library."
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setSelectedImage(result.assets[0].uri);
        setImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePress = async () => {
    setLoading(true);
    await onSubmit(imageUrl);
    setLoading(false);
  };

  const submitImage = () => {
    setToggleCamera(!toggleCamera);
  };
  const cancelCamera = () => {
    setToggleCamera(!toggleCamera);
    setImageUrl("");
    setCapturedImage(null);
    setSelectedImage(null);
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.wrapper} onLayout={onLayoutRootView}>
      {toggleCamera ? (
        <CameraScreen
          cancelCamera={cancelCamera}
          setImageUrl={setImageUrl}
          submitImage={submitImage}
          capturedImage={capturedImage}
          setCapturedImage={setCapturedImage}
          requestPermission={requestPermission}
          permission={permission}
          type={type}
          setSelectedImage={setSelectedImage}
        />
      ) : (
        <View style={styles.container}>
          <View>
            <Text style={[styles.textStyle, styles.header]}>
              Image Captioner! 🤗
            </Text>
          </View>

          <View style={styles.imagePreviewContainer}>
            <Image
              source={ selectedImage ? { uri: selectedImage } : Preview }
              style={[styles.imagePreview, !selectedImage && { width: 100 }]}
              resizeMode="contain"
            />
          </View>

          <View>
            <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
              {caption !== "" && "🪄 " + caption + " 🪄"}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputBox}
              autoCapitalize="none"
              placeholder="Enter Image Link"
              value={imageUrl}
              onChangeText={(url) => setImageUrl(url)}
            />
          </View>

          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                color: "#8C94A5",
                marginVertical: 10,
              }}
            >
              OR
            </Text>
          </View>

          <View style={styles.buttonArea}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#0166FF" },
              ]}
              onPress={submitImage}
            >
              <Text style={styles.ButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonArea}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#0166FF" }]}
              onPress={pickImage}
            >
              <Text style={styles.ButtonText}>Browse Images</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.lineStyle} />

          <View style={[styles.buttonArea, styles.submitBtnArea]}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#212429" }]}
              onPress={handlePress}
            >
              <Text style={styles.ButtonText}>Process</Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <ActivityIndicator
              size="large"
              color="#0000FF"
              style={styles.loading}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    paddingHorizontal: 30,
    paddingVertical: 80,
  },
  container: {
    height: "100%",
  },
  header: {
    fontWeight: 700,
    fontSize: 35,
    fontFamily: "BebasNeue-Regular",
    color: "#29323B",
  },
  textStyle: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 5,
    textAlign: "center",
    color: "#29323B",
  },
  inputContainer: {
    marginTop: 20,
  },
  inputBox: {
    borderColor: "#E1E4EB",
    height: 55,
    width: "100%",
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
    textAlign: "left",
  },
  button: {
    backgroundColor: "blue",
    height: 40,
    width: "100%",
    borderRadius: 5,
    padding: 10,
  },
  buttonArea: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  submitBtnArea: {
    marginVertical: 10,
  },
  ButtonText: {
    color: "white",
    textAlign: "center",
  },
  loading: {
    marginTop: 8,
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
    width: "100%",
    height: 200,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#7BA7FF",
    borderRadius: 5,
  },
  imagePreview: {
    borderRadius: 5,
    width: "100%",
    height: "100%",
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: "#D3D8E3",
    marginBottom: 15,
    marginTop: 10,
  },
});

export default ImageForm;
