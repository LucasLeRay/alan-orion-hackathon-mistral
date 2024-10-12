import { Box, Stack } from '@mui/joy';

import { Header } from '../components/Header';
import { TakePhoto } from '../components/TakePhoto';
import { Recaps } from './Recaps';
import { useRecaps } from '../hooks/useRecaps';

export const HomePage = () => {
  const { recaps, infer, deleteRecap } = useRecaps();

  return (
    <Box width='100vw' height='100vh'>
      <Header />
      <Stack direction='column' spacing={2} padding={2}>
        <TakePhoto onPhoto={infer} />
        <Recaps recaps={recaps} deleteRecap={deleteRecap} />
      </Stack>
    </Box>
  );
};
