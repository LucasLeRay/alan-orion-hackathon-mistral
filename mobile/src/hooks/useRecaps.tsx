import axios from 'axios';
import { toast } from 'sonner';

const INFER_API =
  'https://alan-orion-api-754072912278.europe-west9.run.app/infer/';

export type Recap = {
  photo: string;
  date: Date;
  status: number;
};

export const useRecaps = () => {
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

    return axios
      .post(INFER_API, formData, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log(response.data);
        toast.success('Inference successful');
      })
      .catch(error => {
        console.error(error);
        toast.error('Inference failed');
      });
  }

  return {
    infer,
    isLoading: false,
    recaps: [
      {
        photo:
          'https://media.licdn.com/dms/image/v2/C4D03AQGP-eXROv_nFw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1591192734249?e=1733961600&v=beta&t=XpM3cte94HAY26lDVNnSj88esyB9f1LfbyIwHvPIvkM',
        date: new Date(),
        status: 0.4
      }
    ] as Recap[]
  };
};
