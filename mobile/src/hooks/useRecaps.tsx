import axios from 'axios';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

const INFER_API =
  'https://alan-orion-api-754072912278.europe-west9.run.app/infer/';

const fakeRecaps = [
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'You seem slightly restless, but overall calm.',
    general_score: 0.39,
    date: '2021-09-01 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'You seem a little anxious, but nothing overwhelming.',
    general_score: 0.45,
    date: '2021-09-02 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'You appear very relaxed, nothing seems to bother you.',
    general_score: 0.08,
    date: '2021-09-03 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'There’s some mild tension, but you are managing it.',
    general_score: 0.33,
    date: '2021-09-04 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'You look a bit stressed, maybe take some time to relax.',
    general_score: 0.5,
    date: '2021-09-05 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'Serenity radiates from you, all seems in balance.',
    general_score: 0.11,
    date: '2021-09-06 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'A small hint of stress is visible, but nothing major.',
    general_score: 0.26,
    date: '2021-09-07 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'Tranquility is evident, you seem very composed.',
    general_score: 0.15,
    date: '2021-09-08 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'Some stress is visible, consider taking it easy.',
    general_score: 0.43,
    date: '2021-09-09 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'You seem calm and at peace, no worries.',
    general_score: 0.03,
    date: '2021-09-10 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description:
      'There’s some visible tension, perhaps a short break could help.',
    general_score: 0.48,
    date: '2021-09-11 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'You have a peaceful aura, everything looks in harmony.',
    general_score: 0.05,
    date: '2021-09-12 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'Slight stress is present, but you appear composed.',
    general_score: 0.36,
    date: '2021-09-13 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'A little stress is showing, maybe slow down a bit.',
    general_score: 0.52,
    date: '2021-09-14 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'You seem a bit preoccupied, but handling it well.',
    general_score: 0.29,
    date: '2021-09-15 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'Serenity radiates from you, all seems in balance.',
    general_score: 0.09,
    date: '2021-09-16 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'There’s some mild tension, but you are managing it.',
    general_score: 0.34,
    date: '2021-09-17 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'You look a bit stressed, maybe take some time to relax.',
    general_score: 0.51,
    date: '2021-09-18 12:00:00'
  },
  {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIDbXVvUoDQRQF4K9',
    description: 'Tranquility is evident, you seem very composed.',
    general_score: 0.13,
    date: '2021-09-19 12:00:00'
  }
];

type InferResponse = {
  description: string;
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

export type Recap = {
  image: string;
  description: string;
  general_score: number;
  date: string;
};

export const useRecaps = () => {
  const storedRecaps = JSON.parse(localStorage.getItem('recaps') || '[]');
  const [recaps, setRecaps] = useState<Recap[]>(storedRecaps);

  // localStorage.setItem('recaps', JSON.stringify(fakeRecaps));

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
      .post<InferResponse>(INFER_API, formData, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        const newStoredRecaps = [
          ...storedRecaps,
          {
            image,
            description: response.data.description,
            general_score: response.data.general_score,
            date: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
          }
        ];

        localStorage.setItem('recaps', JSON.stringify(newStoredRecaps));
        setRecaps(newStoredRecaps);

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
    recaps,
    deleteRecap: (index: number) => {
      const newStoredRecaps = storedRecaps.filter((_, i) => i !== index);
      localStorage.setItem('recaps', JSON.stringify(newStoredRecaps));
      setRecaps(newStoredRecaps);
    }
  };
};
