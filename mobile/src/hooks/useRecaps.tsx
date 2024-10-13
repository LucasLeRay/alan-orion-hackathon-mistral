import axios from 'axios';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

const INFER_API =
  'https://alan-orion-api-754072912278.europe-west9.run.app/infer/';

type InferResponse = {
  description: string;
  sentiment: string;
  general_score: number;
  scores: {
    clenched_jaw: { 'jaw tight': number; 'jaw loose': number };
    dark_under_eyes: {
      'dark circles present': number;
      'skin under eyes even': number;
    };
    eye_puffiness: { 'eyes swollen': number; 'eyes normal': number };
    forehead_lines: {
      'forehead wrinkled': number;
      'forehead smooth': number;
    };
    furrowed_brows: { 'brows tense': number; 'brows relaxed': number };
    mouth_frown: {
      'corners of mouth downturned': number;
      'mouth neutral': number;
    };

    pale_skin: { 'skin tone pale': number; 'skin tone vibrant': number };
    redness_in_face: { 'face flushed': number; 'face clear': number };

    shoulder_tension: {
      'shoulders raised': number;
      'shoulders relaxed': number;
    };
    tight_lips: {
      'lips pressed together': number;
      'lips parted naturally': number;
    };
  };
};

export type Recap = Omit<InferResponse, 'scores'> & {
  image: string;
  date: string;
};

async function reduceImageSize(
  base64Image: string,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.7
): Promise<string> {
  return new Promise(resolve => {
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate the new dimensions while maintaining the aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = Math.round(maxWidth / aspectRatio);
        } else {
          height = maxHeight;
          width = Math.round(maxHeight * aspectRatio);
        }
      }

      // Set canvas dimensions to the new size
      canvas.width = width;
      canvas.height = height;

      // Draw the image to the canvas
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert the canvas back to base64 with JPEG compression
      const reducedBase64 = canvas.toDataURL('image/jpeg', quality); // quality from 0 to 1 (lower is more compressed)

      resolve(reducedBase64);
    };
  });
}

export const useRecaps = () => {
  const storedRecaps = JSON.parse(localStorage.getItem('recaps') || '[]');
  const [recaps, setRecaps] = useState<Recap[]>(storedRecaps);
  const [inferIsLoading, setInferIsLoading] = useState(false);

  async function saveRecap(recap: Recap[]) {
    const recapWithReducedImages = await Promise.all(
      (recap as Recap[]).map(async recap => {
        const reducedImage = await reduceImageSize(recap.image, 500, 500);
        return { ...recap, image: reducedImage };
      })
    );

    localStorage.setItem('recaps', JSON.stringify(recapWithReducedImages));
  }

  async function infer(image: string) {
    const byteString = atob(image.split(',')[1]);
    const mimeString = image.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });

    const formData = new FormData();
    formData.append('image', blob, 'image.png'); // 'image.png' is the file name

    setInferIsLoading(true);
    return axios
      .post<InferResponse>(INFER_API, formData, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(async response => {
        const newStoredRecaps: Recap[] = [
          {
            image,
            description: response.data.description,
            sentiment: response.data.sentiment,
            general_score: response.data.general_score,
            date: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
          },
          ...storedRecaps
        ];

        await saveRecap(newStoredRecaps);
        setRecaps(newStoredRecaps);

        console.log(response.data);
        toast.success('Inference successful');
        setInferIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        toast.error('Inference failed');
        setInferIsLoading(false);
      });
  }

  return {
    infer,
    recaps,
    deleteRecap: async (index: number) => {
      const newStoredRecaps = storedRecaps.filter(
        (_: any, i: number) => i !== index
      );
      await saveRecap(newStoredRecaps);
      setRecaps(newStoredRecaps);
    },
    inferIsLoading
  };
};
