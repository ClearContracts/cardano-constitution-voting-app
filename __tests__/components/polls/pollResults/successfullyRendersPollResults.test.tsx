import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { PollResults } from '@/components/polls/pollResults';

test('successfully renders poll results', async () => {
  render(
    <PollResults
      pollId="1"
      votes={{
        yes: [{ name: 'yesTest', id: '1' }],
        no: [{ name: 'noTest', id: '2' }],
        abstain: [{ name: 'abstainTest', id: '3' }],
      }}
    />,
  );
  expect(
    await screen.findByRole('heading', { name: /Results/i }),
  ).toBeDefined();
  expect(await screen.findByRole('heading', { name: /YES/i })).toBeDefined();
  expect(await screen.findByRole('heading', { name: /NO/i })).toBeDefined();
  expect(
    await screen.findByRole('heading', { name: /ABSTAIN/i }),
  ).toBeDefined();
  expect(await screen.findByText(/4/i)).toBeDefined();
  expect(await screen.findByText(/1/i)).toBeDefined();

  expect(await screen.findByText(/80%/i)).toBeDefined();
  expect(await screen.findByText(/20%/i)).toBeDefined();
});
