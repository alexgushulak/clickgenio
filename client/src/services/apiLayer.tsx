// apiFunctions.ts
import axios from 'axios';

const decodeImage = (image_object: any) => {
    const base64_decoded_image = atob(image_object.artifacts[0].base64)
      const byteNumbers = new Array(base64_decoded_image.length);
      for (let i = 0; i < base64_decoded_image.length; i++) {
          byteNumbers[i] = base64_decoded_image.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      let decoded_jpeg_image = new Blob([byteArray], { type: 'image/jpeg' });
      return decoded_jpeg_image
};

const submitData = async (thumbnailText: string) => {
  try {
    await axios.post('https://alex-portfolio-production.up.railway.app/submit', {
      message: thumbnailText
    });
    console.log("Submit Successful");
  } catch (error) {
    console.error("Submit Error:", error);
  }
};

const generateImage = async (thumbnailText: string, apiHost: string, engineId: string, apiKey: string, setImageUrl: (url: string) => void) => {
  try {
    const response = await axios.post(`${apiHost}/v1/generation/${engineId}/text-to-image`, {
      text_prompts: [
        {
          text: thumbnailText,
        },
      ],
      cfg_scale: 7,
      height: 832,
      width: 1216,
      steps: 10,
      samples: 1,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      }
    });

    const image = decodeImage(response.data);
    setImageUrl(URL.createObjectURL(image));
    console.log("Generate Image Successful");
  } catch (error) {
    console.error("Generate Image Error:", error);
  }
};

export { submitData, generateImage };
