import { Box, Stack } from '@mui/joy';

import { Header } from '../components/Header';
import { TakePhoto } from '../components/TakePhoto';
import { Recaps } from './Recaps';
import { Loading } from '../components/Loading';
import { useRecaps } from '../hooks/useRecaps';

export const HomePage = () => {
  const { recaps, isLoading, infer } = useRecaps();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box width='100vw' height='100vh'>
      <Header />
      <Stack direction='column' spacing={2} padding={2}>
        <TakePhoto onPhoto={infer} />
        <Recaps recaps={recaps} />
      </Stack>
    </Box>
  );
};
