import axios from 'axios';
import { toast } from 'sonner';

const INFER_API =
  'https://alan-orion-api-754072912278.europe-west9.run.app/infer';

export type Recap = {
  photo: string;
  date: Date;
  status: number;
};

export const useRecaps = () => {
  async function infer(image: string) {
    return axios
      .post(
        INFER_API,
        {
          image
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        }
      )
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
