import Head from 'next/head';
import Link from 'next/link';
import HomeRounded from '@mui/icons-material/HomeRounded';
import { Box, Button, Typography } from '@mui/material';

export default function Custom404(): JSX.Element {
  return (
    <>
      <Head>
        <title>Constitutional Convention Voting App</title>
        <meta name="404" content="404 error page for Clarity" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="img/png" href="/cardano.png" />
      </Head>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Typography variant="h1" fontWeight="bold">
          404 - Page Not Found
        </Typography>
        <Link href="/">
          <Button variant="contained">
            <Box display="flex" flexDirection="row" gap={2}>
              <HomeRounded />
              <Typography>Go Home</Typography>
            </Box>
          </Button>
        </Link>
      </Box>
    </>
  );
}
