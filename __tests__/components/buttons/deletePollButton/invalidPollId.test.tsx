import { deletePollInvalidPollIdErrorHandler } from '@/../__mocks__/deletePoll/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { DeletePollButton } from '@/components/buttons/deletePollButton';

test('alerts user when poll ID is not valid', async () => {
  server.use(...deletePollInvalidPollIdErrorHandler);
  const user = userEvent.setup();

  render(
    <>
      <DeletePollButton pollId="1" />
      <Toaster />
    </>,
  );

  const submitButton = screen.getByRole('button');
  await user.click(submitButton);

  expect(await screen.findByText('Invalid pollId')).toBeDefined();
});
