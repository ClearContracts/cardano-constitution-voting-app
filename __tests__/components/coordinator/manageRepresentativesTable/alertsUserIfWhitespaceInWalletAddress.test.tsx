import { server } from '@/../__mocks__/server';
import { updateUserAddressWhitespaceHandler } from '@/../__mocks__/updateUser/errorHandlers';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { ManageRepresentativesTable } from '@/components/coordinator/manageRepresentativesTable';

test('alerts user if whitespace in wallet address', async () => {
  server.use(...updateUserAddressWhitespaceHandler);
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

  // Wait for the error toast to appear
  const errorToast = await screen.findByText(
    'Wallet address must not have leading or trailing whitespace.',
  );
  expect(errorToast).toBeDefined();

  const newWalletAddress = await screen.findByText(
    'addr1isdufnpoasidjfopmaimdfmopisadj',
  );
  expect(newWalletAddress).toBeDefined();
});
