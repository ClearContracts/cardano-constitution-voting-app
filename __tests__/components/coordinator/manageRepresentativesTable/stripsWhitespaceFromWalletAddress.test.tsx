import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { ManageRepresentativesTable } from '@/components/coordinator/manageRepresentativesTable';

test('strips whitespace from wallet address', async () => {
  const user = userEvent.setup();
  render(
    <>
      <Toaster />
      <ManageRepresentativesTable toggleRefresh={() => {}} />
    </>,
  );

  const editButton = await screen.findByTestId('edit-representative-info-1');
  await user.click(editButton);

  const input = screen.getByDisplayValue('addr1isdufnpoasidjfopmaimdfmopisadj');
  await user.clear(input);
  await user.type(input, '  coStakeAddress  ');

  const saveButton = await screen.findByTestId('save-representative-info-1');
  await user.click(saveButton);

  // Wait for the success toast to appear
  const successToast = await screen.findByText('User info updated!');
  expect(successToast).toBeDefined();

  const newWalletAddress = await screen.findByText('coStakeAddress');
  expect(newWalletAddress).toBeDefined();
});
