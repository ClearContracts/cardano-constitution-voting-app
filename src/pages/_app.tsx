import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { WalletContextProvider } from '@/context/WalletContext';
import { ReactQueryProvider } from '@/providers/reactQueryProvider';
import { ColorModeProvider } from '@/providers/themeProvider';
import * as Sentry from '@sentry/nextjs';
import { SessionProvider } from 'next-auth/react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainContentErrorFallback } from '@/components/fallbacks/mainContentErrorFallback';
import { Layout } from '@/components/layout/layout';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();

  function myErrorHandler(error: Error): void {
    Sentry.captureException(error);
  }

  return (
    <ErrorBoundary
      FallbackComponent={MainContentErrorFallback}
      onError={myErrorHandler}
      onReset={async (): Promise<void> => {
        await router.push('/');
        window.location.reload();
      }}
    >
      <SessionProvider>
        <ReactQueryProvider>
          <ColorModeProvider>
            <WalletContextProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </WalletContextProvider>
          </ColorModeProvider>
        </ReactQueryProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
