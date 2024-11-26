import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollCarrousel } from '@/components/polls/pollCarrousel';

import { getPollsErrorHandlers } from '../../../../__mocks__/getPolls/errorHandlers';

test('handles no polls or error', async () => {
  server.use(...getPollsErrorHandlers);
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
      <PollCarrousel currentPollId="1" />
    </SessionProvider>,
  );

  const noPollsYetText = await screen.findByText(/No Polls yet/i);
  expect(noPollsYetText).toBeDefined();
});
