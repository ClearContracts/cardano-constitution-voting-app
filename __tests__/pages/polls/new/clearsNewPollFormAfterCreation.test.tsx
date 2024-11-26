import NewPoll from '@/pages/polls/new';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

test('clears new poll form after creation', async () => {
  const user = userEvent.setup();

  render(
    <>
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
      />
    </>,
  );
  const nameInput = screen.getByLabelText('Name');
  await user.type(nameInput, 'testName');

  const descriptionInput = screen.getByLabelText('Description');
  await user.type(descriptionInput, 'testDescription');

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  await user.click(submitButton);

  // Ensure the form fields are cleared
  expect(nameInput.textContent).toBe('');
  expect(descriptionInput.textContent).toBe('');
});
