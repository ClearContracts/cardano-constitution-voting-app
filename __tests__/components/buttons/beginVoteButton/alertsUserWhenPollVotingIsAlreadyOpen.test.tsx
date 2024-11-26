import { server } from '@/../__mocks__/server';
import { startVotingNotPendingHandler } from '@/../__mocks__/startVoting/errorHandlers';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { BeginVoteButton } from '@/components/buttons/beginVoteButton';

test('alerts user when poll voting is already open', async () => {
  server.use(...startVotingNotPendingHandler);
  const user = userEvent.setup();
  render(
    <>
      <Toaster />
      <BeginVoteButton pollId="1" />,
    </>,
  );

  const beginVoteButton = screen.getByRole('button', {
    name: /Begin Voting/i,
  });
  expect(beginVoteButton).toBeDefined();
  await user.click(beginVoteButton);
  const successToast = await screen.findByText('Poll is not pending');
  expect(successToast).toBeDefined();
});
