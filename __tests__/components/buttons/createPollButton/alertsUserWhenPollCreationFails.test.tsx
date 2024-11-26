import { newPollInternalErrorHandler } from '@/../__mocks__/newPoll/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { CreatePollButton } from '@/components/buttons/createPollButton';

test('alerts user when poll creation fails', async () => {
  server.use(...newPollInternalErrorHandler);
  const user = userEvent.setup();
  render(
    <>
      <Toaster />
      <CreatePollButton
        name="test poll"
        hashedText="1dda86a28da3715e618a1605f81c7a3121ce767cdc9bd0d46beec0bef40e8125"
        link="https://2024constitutionalconsultation.docs.intersectmbo.org/cardanos-constitution/draft-cardano-constitution"
        setName={() => {}}
        setConstitutionText={() => {}}
        setLink={() => {}}
        disabled={false}
      />
    </>,
  );

  const createPollButton = screen.getByRole('button', {
    name: /Submit/i,
  });
  expect(createPollButton).toBeDefined();
  await user.click(createPollButton);
  const toast = await screen.findByText(/Error creating new Poll./i);
  expect(toast).toBeDefined();
});
