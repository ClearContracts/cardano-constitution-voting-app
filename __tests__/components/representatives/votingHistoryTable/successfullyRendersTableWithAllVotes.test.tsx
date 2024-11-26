import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { VotingHistoryTable } from '@/components/representatives/votingHistoryTable';

test('successfully renders table with all votes', async () => {
  render(
    <VotingHistoryTable
      userId={'1'}
      polls={[
        {
          id: '1',
          name: 'test',
          hashedText:
            '1dda86a28da3715e618a1605f81c7a3121ce767cdc9bd0d46beec0bef40e8125',
          link: 'https://www.intersectmbo.org/constitution/constitution.html',
          status: 'voting',
          summary_tx_id: null,
          is_archived: false,
        },
      ]}
      votes={[
        {
          poll_id: '1',
          user_id: '1',
          vote: 'yes',
          signature: 'signature',
          hashed_message: 'hashed_message',
          poll_transaction_id: '1',
        },
      ]}
    />,
  );
  expect(await screen.findByTestId('yes-1')).toBeDefined();
  expect(await screen.findByTestId('no-2')).toBeDefined();
  expect(await screen.findByTestId('abstain-3')).toBeDefined();
});
