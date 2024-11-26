import { getUserInvalidMethodHandler } from '@/../__mocks__/getUser/errorHandlers';
import { server } from '@/../__mocks__/server';
import Representative from '@/pages/representatives/[userId]';
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

// TODO: Have not been able to get this test to pass as it depends on URL params
test.skip('Alerts user when method not allowed on view representative page', async () => {
  server.use(...getUserInvalidMethodHandler);
  render(
    <SessionProvider
      session={{
        expires: '1',
        user: {
          id: '1',
          stakeAddress: 'stakeAddress',
          walletName: 'walletName',
          isCoordinator: false,
          isDelegate: true,
          isAlternate: false,
        },
      }}
    >
      <Toaster />
      <Representative />
    </SessionProvider>,
  );

  const alert = await screen.findByText(/method not allowed/);
  expect(alert).toBeDefined();
});
