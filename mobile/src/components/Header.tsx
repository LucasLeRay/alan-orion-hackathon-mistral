import { Box, Stack } from '@mui/joy';
import OrionSVG from '../assets/orion.svg';

export const Header = () => {
  return (
    <Box
      width='100vw'
      height='90px'
      padding={2}
      display='flex'
      flexDirection='column'
    >
      <Stack direction='row' alignItems='end' justifyContent='space-between'>
        <Stack direction='row' alignItems='center' spacing={1}>
          <img
            src={OrionSVG}
            alt='orion icon'
            style={{
              width: '64px'
            }}
          />
        </Stack>
      </Stack>
    </Box>
  );
};
