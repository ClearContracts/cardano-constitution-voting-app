import { endVotingNotFoundHandler } from '@/../__mocks__/endVoting/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { EndVoteButton } from '@/components/buttons/endVoteButton';

test('alerts user when poll is not found', async () => {
  server.use(...endVotingNotFoundHandler);
  const user = userEvent.setup();
  render(
    <>
      <Toaster />
      <EndVoteButton
        pollId="1"
        updatePollResults={() => {}}
        onClick={() => {}}
      />
    </>,
  );

  const endVoteButton = screen.getByRole('button', {
    name: /End Voting/i,
  });
  expect(endVoteButton).toBeDefined();
  await user.click(endVoteButton);
  const toast = await screen.findByText(/poll not found/i);
  expect(toast).toBeDefined();
});
