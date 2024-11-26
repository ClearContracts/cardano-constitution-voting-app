import NewPoll from '@/pages/polls/new';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

test('renders the form with name and description inputs', () => {
  render(
    <NewPoll
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
    />,
  );

  // Check if the form elements are rendered
  expect(screen.getByLabelText(/Name/i)).toBeDefined();
  expect(screen.getByLabelText(/Description/i)).toBeDefined();
  expect(screen.getByRole('button', { name: /Submit/i })).toBeDefined();
});
