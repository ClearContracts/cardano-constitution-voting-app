import gradient from '@/img/constitution-gradient.png';
import texture from '@/img/Pattern.png';
import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import type { FallbackProps } from 'react-error-boundary';

import styles from '@/styles/Layout.module.css';

// Refer to https://github.com/bvaughn/react-error-boundary/issues/57 for TS props
// Refer to https://www.npmjs.com/package/react-error-boundary to add logging
export function MainContentErrorFallback({
  resetErrorBoundary,
}: FallbackProps): JSX.Element {
  return (
    <>
      <Box
        sx={{
          background: 'rgb(13,26,61)',
          backgroundImage: `url(${gradient.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
        className={styles.background}
      />
      <Box
        sx={{
          backgroundImage: `url(${texture.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className={styles.backgroundTexture}
        mt="75px"
      />
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography
          sx={{ fontSize: '1.5rem', color: '#FFFFFF', fontFamily: 'Chivo' }}
          variant="h4"
        >
          Failed to load content. Please return to the home page.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'rgba(192,221,255)',
            color: 'rgb(0,33,112,1) !important',
          }}
          onClick={resetErrorBoundary}
        >
          Return to home page
        </Button>
      </Box>
    </>
  );
}
