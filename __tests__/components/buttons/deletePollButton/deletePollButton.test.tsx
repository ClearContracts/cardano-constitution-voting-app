import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { DeletePollButton } from '@/components/buttons/deletePollButton';

test('successfully deletes poll', async () => {
  const user = userEvent.setup();

  render(
    <>
      <DeletePollButton pollId="1" />
      <Toaster />
    </>,
  );

  const submitButton = screen.getByRole('button');
  await user.click(submitButton);

  expect(await screen.findByText('Poll deleted!')).toBeDefined();
});
