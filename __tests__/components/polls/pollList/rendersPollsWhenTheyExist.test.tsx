import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollList } from '@/components/polls/pollList';

test('renders polls when they exist', async () => {
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
      <PollList />
    </SessionProvider>,
  );

  // I think both mobile and desktop are showing since this environment does
  // not have a window object to determine the screen size.
  const pollCard = await screen.findByText(/Poll #3/i);
  expect(pollCard).toBeDefined();
});
