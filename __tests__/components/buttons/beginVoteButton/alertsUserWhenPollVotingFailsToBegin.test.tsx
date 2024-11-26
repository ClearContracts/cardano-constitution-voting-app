import { server } from '@/../__mocks__/server';
import { startVotingInternalErrorHandler } from '@/../__mocks__/startVoting/errorHandlers';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { BeginVoteButton } from '@/components/buttons/beginVoteButton';

test('alerts user when poll voting fails to begin', async () => {
  server.use(...startVotingInternalErrorHandler);
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
  const successToast = await screen.findByText(
    'Error starting voting for Poll.',
  );
  expect(successToast).toBeDefined();
});
