import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollCard } from '@/components/polls/pollCard';

test('correctly renders 1 vote', async () => {
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
  const voteCount = await screen.findByText('1 vote');
  expect(voteCount).toBeDefined();
});
