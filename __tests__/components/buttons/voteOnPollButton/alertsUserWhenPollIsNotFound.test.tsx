import { newPollVotePollNotFoundHandler } from '@/../__mocks__/newPollVote/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { VoteOnPollButtons } from '@/components/buttons/voteOnPollButtons';

test.skip('alerts user when poll is not found', async () => {
  server.use(...newPollVotePollNotFoundHandler);
  const user = userEvent.setup();
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
      <VoteOnPollButtons
        pollName="Test Poll"
        pollId="1"
        hashedText="1dda86a28da3715e618a1605f81c7a3121ce767cdc9bd0d46beec0bef40e8125"
        link="https://www.intersectmbo.org/constitution/constitution.html"
      />
    </SessionProvider>,
  );

  const yesVoteButton = screen.getByRole('button', {
    name: /yes/i,
  });
  expect(yesVoteButton).toBeDefined();
  await user.click(yesVoteButton);
  const toast = await screen.findByText(/poll not found/i);
  expect(toast).toBeDefined();
});
