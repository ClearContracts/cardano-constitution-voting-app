import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { DownloadUserVotesButton } from '@/components/buttons/downloadUserVotesButton';

// This mock environment has difficulty simulating blob responses which is what the downloadUserVotes function returns.
// This test is skipped because it will not work in the current environment. This will need to rely on E2E tests.
test.skip('alerts user when successful', async () => {
  const user = userEvent.setup();
  render(
    <>
      <Toaster />
      <DownloadUserVotesButton userId="1" />
    </>,
  );

  const button = screen.getByRole('button', {
    name: /Download votes/i,
  });
  expect(button).toBeDefined();
  await user.click(button);
  const toast = await screen.findByText(/User votes downloaded/i);
  expect(toast).toBeDefined();
});
