// apiFunctions.ts
import axios from 'axios';

const decodeImage = (image_object: any) => {
    const base64_decoded_image = atob(image_object)
      const byteNumbers = new Array(base64_decoded_image.length);
      for (let i = 0; i < base64_decoded_image.length; i++) {
          byteNumbers[i] = base64_decoded_image.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      let decoded_jpeg_image = new Blob([byteArray], { type: 'image/jpeg' });
      return decoded_jpeg_image
};

const generateImage = async (thumbnailText: string, apiHost: string, engineId: string, apiKey: string, setImageUrl: (url: string) => void) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_APISERVER}/generate`, {
      message: thumbnailText
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
    const image = decodeImage(response.data.raw_data);
    setImageUrl(URL.createObjectURL(image));
    console.log("Generate Image Successful");
  } catch (error) {
    console.error("Generate Image Error:", error);
  }
};

export default generateImage;
