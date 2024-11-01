import { newPollNoDescriptionHandler } from '@/../__mocks__/newPoll/errorHandlers';
import { server } from '@/../__mocks__/server';
import NewPoll from '@/pages/polls/new';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

test('alerts user when description is empty, maintains form', async () => {
  server.use(...newPollNoDescriptionHandler);
  const user = userEvent.setup();

  render(
    <>
      <Toaster />
      <NewPoll />
    </>,
  );

  const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
  await user.type(nameInput, 'testName');

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  await user.click(submitButton);

  const errorToast = await screen.findByText(/Description must be provided./i);
  expect(errorToast).toBeDefined();

  // Ensure the form is not cleared since the submission failed
  expect(nameInput.value).toBe('testName');
});
