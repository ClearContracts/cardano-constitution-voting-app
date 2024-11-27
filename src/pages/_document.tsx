import { Head, Html, Main, NextScript } from 'next/document';
import CssBaseline from '@mui/material/CssBaseline';

export default function Document(): JSX.Element {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Html lang="en">
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Chivo:wght@300;400;500;600;700;800;900&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    </>
  );
}
