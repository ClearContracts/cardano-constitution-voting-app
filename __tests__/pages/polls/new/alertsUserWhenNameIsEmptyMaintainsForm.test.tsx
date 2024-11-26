import { newPollNoNameHandler } from '@/../__mocks__/newPoll/errorHandlers';
import { server } from '@/../__mocks__/server';
import NewPoll from '@/pages/polls/new';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

test('alerts user when name is empty, maintains form', async () => {
  server.use(...newPollNoNameHandler);
  const user = userEvent.setup();

  render(
    <>
      <Toaster />
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

  const descriptionInput = screen.getByLabelText('Description');
  await user.type(descriptionInput, 'testDescription');

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  await user.click(submitButton);

  // Wait for the error toast to appear
  const errorToast = await screen.findByText(/Name must be provided./i);
  expect(errorToast).toBeDefined();

  // Ensure the form is not cleared since the submission failed
  expect(descriptionInput.textContent).toEqual('testDescription');
});
