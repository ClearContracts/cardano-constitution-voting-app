import { newPollTooLongNameHandler } from '@/../__mocks__/newPoll/errorHandlers';
import { server } from '@/../__mocks__/server';
import NewPoll from '@/pages/polls/new';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

test('alerts user when name is longer than 255 characters, maintains form', async () => {
  server.use(...newPollTooLongNameHandler);
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

  const nameInput = screen.getByRole('textbox', {
    name: /Name/i,
  }) as HTMLInputElement;
  await user.type(
    nameInput,
    'fdsfdasfjkdlsjfklds;jfkldsjfklds;jfkldsjfkld;sjfkldsjfklds;jadfkl;dsjfklds;ajfksd;jfkldsajfkdsa;jfkl;dsfjdsauf89dsu8f9dus9afuds89fu8d9sfud8s9auf89dsauf89sduf89sdpuf89psdauf89pdsauf89dsuf89dsuf89dsuf89dsauf89dsuf89dsauf89sduf89psauf89pdsuf89dpsuf89pdsuf89sauf8d9sauf89dsuf89pdsauf',
  );

  const descriptionInput = screen.getByLabelText('Description');
  await user.type(descriptionInput, 'testDescription');

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  await user.click(submitButton);

  // Wait for the error toast to appear
  const errorToast = expect(
    await screen.findByText(/Name must be less than 255 characters./i),
  ).toBeDefined();
  expect(errorToast).toBeDefined();

  // Ensure the form is not cleared since the submission failed
  expect(nameInput.value).toEqual(
    'fdsfdasfjkdlsjfklds;jfkldsjfklds;jfkldsjfkld;sjfkldsjfklds;jadfkl;dsjfklds;ajfksd;jfkldsajfkdsa;jfkl;dsfjdsauf89dsu8f9dus9afuds89fu8d9sfud8s9auf89dsauf89sduf89sdpuf89psdauf89pdsauf89dsuf89dsuf89dsuf89dsauf89dsuf89dsauf89sduf89psauf89pdsuf89dpsuf89pdsuf89sauf8d9sauf89dsuf89pdsauf',
  );
  expect(descriptionInput.textContent).toEqual('testDescription');
});
