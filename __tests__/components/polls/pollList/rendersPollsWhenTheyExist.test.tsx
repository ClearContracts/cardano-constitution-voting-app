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
      <PollList
        polls={[
          {
            id: '1',
            name: 'test',
            hashedText:
              '1dda86a28da3715e618a1605f81c7a3121ce767cdc9bd0d46beec0bef40e8125',
            link: 'https://www.intersectmbo.org/constitution/constitution.html',
            status: 'voting',
            summary_tx_id: null,
            is_archived: false,
          },
        ]}
      />
    </SessionProvider>,
  );

  // I think both mobile and desktop are showing since this environment does
  // not have a window object to determine the screen size.
  const pollCard = await screen.findByText(/Poll #3/i);
  expect(pollCard).toBeDefined();
});
