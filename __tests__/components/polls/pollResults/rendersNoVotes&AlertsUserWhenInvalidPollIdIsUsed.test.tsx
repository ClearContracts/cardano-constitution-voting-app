import { getPollResultsInvalidIdHandler } from '@/../__mocks__/getPollResults/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollResults } from '@/components/polls/pollResults';

test('renders no votes & alerts user when invalid poll id is used', async () => {
  server.use(...getPollResultsInvalidIdHandler);
  render(
    <>
      <PollResults
        pollId="1"
        votes={{
          yes: [{ name: 'yesTest', id: '1' }],
          no: [{ name: 'noTest', id: '2' }],
          abstain: [{ name: 'abstainTest', id: '3' }],
        }}
      />
      <Toaster />
    </>,
  );

  expect(await screen.findAllByText(/0%/i)).toBeDefined();
  expect(await screen.findByText('Invalid pollId')).toBeDefined();
});
