import { server } from '@/../__mocks__/server';
import { updateActiveVoterWorkshopNotFoundHandler } from '@/../__mocks__/updateActiveVoter/errorHandlers';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { ManageActivePowerTable } from '@/components/coordinator/manageActivePowerTable';

test('Successfully alerts when workshop is not found', async () => {
  server.use(...updateActiveVoterWorkshopNotFoundHandler);
  const user = userEvent.setup();
  render(
    <>
      <Toaster />
      <ManageActivePowerTable />
    </>,
  );

  const submitButton = await screen.findByTestId('edit-active-voter-1');
  await user.click(submitButton);

  const saveButton = await screen.findByTestId('save-active-voter-1');
  await user.click(saveButton);

  // Wait for the error toast to appear
  const errorToast = await screen.findByText('Workshop not found');
  expect(errorToast).toBeDefined();
});
