import ViewPoll from '@/pages/polls/[pollId]/index';
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import mockRouter from 'next-router-mock';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { expect, test } from 'vitest';

// TODO: Have not been able to get this test to pass as it depends on URL params
test.skip('renders name, description, and status', async () => {
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

  const name = await screen.findByText(/test poll/i);
  const description = await screen.findByText(/this is a test poll/i);
  const status = await screen.findByText(/pending/i);
  expect(name).toBeDefined();
  expect(description).toBeDefined();
  expect(status).toBeDefined();
});
