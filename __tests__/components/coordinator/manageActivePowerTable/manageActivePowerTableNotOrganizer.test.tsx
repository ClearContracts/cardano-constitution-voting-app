import { server } from '@/../__mocks__/server';
import { updateActiveVoterNotOrganizerHandler } from '@/../__mocks__/updateActiveVoter/errorHandlers';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { ManageActivePowerTable } from '@/components/coordinator/manageActivePowerTable';

test('Successfully alerts when non-organizer attempts to update active voter', async () => {
  server.use(...updateActiveVoterNotOrganizerHandler);
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
  const errorToast = await screen.findByText(
    'You must be an Organizer to update active voter.', // TODO: Ensure this message matches the actual message when the check is created
  );
  expect(errorToast).toBeDefined();
});
