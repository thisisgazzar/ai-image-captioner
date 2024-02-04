import React from "react";
import axios from "axios";
import { render, waitFor, fireEvent, act } from "@testing-library/react-native";
import { Camera } from "expo-camera";
import ImageForm from "../components/ImageForm";
import App from "../App";

jest.mock("axios");

jest.mock("expo-image-picker", () => ({
  ...jest.requireActual("expo-image-picker"),
  requestMediaLibraryPermissionsAsync: jest.fn(),
}));

describe("App", () => {
  describe("ImageForm Component", () => {
    it("renders correctly", async () => {
      require("expo-image-picker").requestMediaLibraryPermissionsAsync.mockResolvedValue(
        {
          status: "granted",
        }
      );

      const { getByText, getByPlaceholderText } = render(<ImageForm />);

      await waitFor(() => {
        expect(getByText("Image Captioner! 🤗")).toBeTruthy();
      });
      await waitFor(() => {
        expect(getByPlaceholderText("Enter Image Link")).toBeTruthy();
      });
    });

    it("handles submit button press correctly", async () => {
      const mockOnSubmit = jest.fn();
      const { getByPlaceholderText, getByText, getByTestId } = render(
        <ImageForm onSubmit={mockOnSubmit} />
      );

      const input = getByPlaceholderText("Enter Image Link");
      const submitButton = getByText("Process");

      fireEvent.changeText(input, "https://example.com/image.jpg");

      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          "https://example.com/image.jpg"
        );
      });
    });

    it("handles image URL submission and displays the generated caption", async () => {
      const mockCaption = "Mock Caption";
      axios.post.mockResolvedValue({ data: [{ generated_text: mockCaption }] });
      const { getByPlaceholderText, getByText } = render(<App />);
      const input = getByPlaceholderText("Enter Image Link");
      await act(() => {
        fireEvent.changeText(input, "https://example.com/image.jpg");
      });
      await act(() => {
        const submitButton = getByText("Process");
        fireEvent.press(submitButton);
      });
      await waitFor(() =>
        expect(getByText(`🪄 ${mockCaption} 🪄`)).toBeTruthy()
      );
    });
  });

  describe("CameraScreen Component", () => {
    it("shows camera if permissions are granted", async () => {
      jest
        .spyOn(Camera, "useCameraPermissions")
        .mockReturnValue([{ granted: true }, () => Promise.resolve({})]);

      const { getByTestId, getByText } = render(<App />);
      await act(() => {
        fireEvent.press(getByText("Take Photo"));
      });

      const camera = getByTestId("camera-screen");
      expect(camera).toBeTruthy();
    });

    it("takes a picture and displays preview", async () => {
      jest
        .spyOn(Camera, "useCameraPermissions")
        .mockReturnValue([{ granted: true }, () => Promise.resolve({})]);

      jest
        .spyOn(Camera.prototype, "takePictureAsync")
        .mockImplementation(() => {
          return Promise.resolve({
            uri: "file://some-file.jpg",
          });
        });

      const { getByTestId, getByText } = render(<App />);

      fireEvent.press(getByText("Take Photo"));

      const captureButton = getByTestId("capture-button");

      fireEvent.press(captureButton);
      await waitFor(() => {
        expect(getByText("Captured Image Preview")).toBeTruthy();
      });
    });
  });
});
