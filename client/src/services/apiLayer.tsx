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
    const response = await axios.post(`${import.meta.env.VITE_APISERVER}/submit`, {
      message: thumbnailText
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
    const image = decodeImage(response.data.imageBase64);
    setImageUrl(URL.createObjectURL(image));
    console.log("Generate Image Successful");
    return response.data.imageId;
  } catch (error) {
    console.error("Generate Image Error:", error);
  }
};

const submitIPData = async (thumbnailText: string) => {
  try {
    await axios.post(`${import.meta.env.VITE_APISERVER}/metadata`, {
      message: thumbnailText
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
    console.log("metadata successful")
  } catch (error) {
    console.error("metadata error")
  }
}

const submitThumbnailData = async (thumbnailText: string) => {
  try {
    await axios.post(`${import.meta.env.VITE_APISERVER}/metadata`, {
      message: `Submission: ${thumbnailText}`
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
    console.log("metadata successful")
  } catch (error) {
    console.error("metadata error")
  }
}

const submitDownloadData = async (thumbnailText: string) => {
  try {
    await axios.post(`${import.meta.env.VITE_APISERVER}/metadata`, {
      message: `Image Downloaded`
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
    console.log("metadata successful")
  } catch (error) {
    console.error("metadata error")
  }
}

const submitBuyData = async (thumbnailText: string) => {
  try {
    await axios.post(`${import.meta.env.VITE_APISERVER}/metadata`, {
      message: `Image Buy Button Clicked`
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
    console.log("metadata successful")
  } catch (error) {
    console.error("metadata error")
  }
}

const downloadImage = async (imageUrl: string, setImageDownloadUrl: (url: string) => void) => {
  try {
    setImageDownloadUrl(`${import.meta.env.VITE_APISERVER}/download/?id=${imageUrl}`)
    console.log("Download Successful")
  } catch (err) {
    console.log("Download Error:", err)
  }
}



export { generateImage, submitIPData, downloadImage, submitThumbnailData, submitDownloadData, submitBuyData };
