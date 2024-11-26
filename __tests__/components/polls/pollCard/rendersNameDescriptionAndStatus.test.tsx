import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollCard } from '@/components/polls/pollCard';

test('renders name, description, and status', async () => {
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
  const name = screen.getByText('test');
  const description = screen.getByText('test description');
  const status = screen.getByText('Voting');
  expect(name).toBeDefined();
  expect(description).toBeDefined();
  expect(status).toBeDefined();
});
