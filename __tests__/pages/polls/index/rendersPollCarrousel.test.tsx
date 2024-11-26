import ViewPoll from '@/pages/polls/[pollId]/index';
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import mockRouter from 'next-router-mock';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { expect, test } from 'vitest';

test('renders poll carrousel', async () => {
  mockRouter.useParser(
    createDynamicRouteParser([
      // These paths should match those found in the `/pages` folder:
      '/polls/[pollId]',
    ]),
  );
  mockRouter.push('/polls/1');
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

  // Because JSDOM does not have a window object, the carrousel renders both the desktop and mobile versions
  const pollCarrousel = await screen.findAllByTestId('poll-card-4');
  expect(pollCarrousel).toHaveLength(2);
});
