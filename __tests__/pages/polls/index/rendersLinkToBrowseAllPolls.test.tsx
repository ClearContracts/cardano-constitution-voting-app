import ViewPoll from '@/pages/polls/[pollId]/index';
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { expect, test } from 'vitest';

test('renders link to browse all polls', async () => {
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
      <ViewPoll />
    </SessionProvider>,
  );

  const link = screen.getByRole('link', { name: /view all polls/i });
  expect(link).toBeDefined();
});
