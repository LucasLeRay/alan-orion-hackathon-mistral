import { Box, Stack, Typography } from '@mui/joy';
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
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        p={2}
      >
        <img
          src={OrionSVG}
          alt='orion'
          style={{
            width: '64px'
          }}
        />
        <Typography
          level='h4'
          sx={{
            color: '#22E39E'
          }}
        >
          Orion
        </Typography>
      </Stack>
    </Box>
  );
};
