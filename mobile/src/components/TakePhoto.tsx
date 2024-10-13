import { IconButton, Box, Stack } from '@mui/joy';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UploadIcon from '@mui/icons-material/Upload';
import { useState } from 'react';

export const TakePhoto = ({
  onPhoto,
  inferIsLoading
}: {
  onPhoto: (photo: string) => void;
  inferIsLoading: boolean;
}) => {
  const [photo, setPhoto] = useState<string | null>(null);

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',

          width: '100%',
          height: '360px',
          // backgroundColor: '#F5F5F5',
          position: 'relative'
        }}
      >
        {photo && (
          <img
            alt='Photo'
            src={photo}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}
        {!photo && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: '#F5F5F5',
              borderRadius: '8px'
            }}
          >
            <Box>Selfie 😁</Box>
          </Box>
        )}
      </Box>
      <Stack direction='row' spacing={2} justifyContent='center'>
        <IconButton
          onClick={() => {
            console.log('Take photo');
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            // input.capture = 'user'; // Try commenting this out for now
            input.onchange = event => {
              console.log('event.target', event.target);

              const file = (event.target as HTMLInputElement).files?.[0];
              if (file) {
                if (file.size > 10 * 1024 * 1024) {
                  alert(
                    'Image exceeds the 10MB size limit. Please select a smaller image.'
                  );
                  return; // Prevent further execution
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64Image = reader.result as string;
                  setPhoto(base64Image); // Update state with the image base64 data
                };
                reader.readAsDataURL(file);
              }
            };
            input.click();
          }}
        >
          <PhotoCameraIcon style={{ color: '#5b59f3' }} />
        </IconButton>
        <IconButton
          loading={inferIsLoading}
          disabled={!photo}
          onClick={() => {
            if (photo) {
              onPhoto(photo);
            }
          }}
        >
          <UploadIcon style={{ color: '#5b59f3' }} />
        </IconButton>
      </Stack>
    </Stack>
  );
};
