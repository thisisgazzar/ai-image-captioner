import React, { useState } from "react";
import axios from "axios";
import ImageForm from "./components/ImageForm";

const App = () => {
  const [caption, setCaption] = useState("");

  const handleImageUrl = async (imageUrl) => {
    try {
      let image = await (await fetch(imageUrl)).blob();
      const HUGGING_FACE_API_KEY = "HUGGING_FACE_API_KEY";
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning",
        image,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          },
          transformRequest: [(data) => data],
        }
      );
      setCaption(response.data[0].generated_text);
    } catch (error) {
      console.error(error);
    }
  };

  return <ImageForm onSubmit={handleImageUrl} caption={caption} />;
};

export default App;
