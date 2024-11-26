import { getPollVoteCountInvalidIdHandler } from '@/../__mocks__/getPollVoteCount/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollCard } from '@/components/polls/pollCard';

test('alerts user when poll ID is invalid', async () => {
  server.use(...getPollVoteCountInvalidIdHandler);
  render(
    <>
      <Toaster />
      <PollCard
        poll={{
          id: '1',
          name: 'test',
          hashedText:
            '1dda86a28da3715e618a1605f81c7a3121ce767cdc9bd0d46beec0bef40e8125',
          link: 'https://www.intersectmbo.org/constitution/constitution.html',
          status: 'voting',
          summary_tx_id: null,
          is_archived: false,
        }}
      />
    </>,
  );

  const toast = await screen.findByText(/Invalid pollId/i);
  expect(toast).toBeDefined();
});
