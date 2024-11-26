import { getPollVoteCountNegative2Handlers } from '@/../__mocks__/getPollVoteCount/handlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollCard } from '@/components/polls/pollCard';

test('correctly renders -2 vote count', async () => {
  server.use(...getPollVoteCountNegative2Handlers);
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
  const voteCount = await screen.findByText('0 votes');
  expect(voteCount).toBeDefined();
});
