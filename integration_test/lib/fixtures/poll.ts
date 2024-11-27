import { faker } from '@faker-js/faker';
import { test as base } from '@fixtures/walletExtension';
import {
  newDelegate2Page,
  newDelegate3Page,
  newDelegate1Page,
  newOrganizer1Page,
} from '@helpers/page';
import HomePage from '@pages/homePage';
import PollPage from '@pages/pollPage';
import { expect, Page } from '@playwright/test';

type pollEnableType =
  | 'CreatePoll'
  | 'CreateAndBeginPoll'
  | 'NoAction'
  | 'VotedPoll'
  | 'CreatePollWithoutTeardown'
  | 'CreatePollWithCustomHash'
  | 'CreateAndBeginPollWithCustomHash'
  | 'VotedPollWithCustomHash';

type TestOptions = {
  pollType: pollEnableType;
};

export const test = base.extend<TestOptions & { pollId: number }>({
  pollType: ['NoAction', { option: true }],

  pollId: async ({ browser, pollType }, use) => {
    // setup
    const organizerPage = await newOrganizer1Page(browser);

    let pages: Page[] = [];
    const homePage = new HomePage(organizerPage);
    await homePage.goto();
    const organizerPollPage = new PollPage(organizerPage);
    const randomName = faker.commerce.productName();

    let pollId: number | undefined;

    if (pollType !== 'NoAction') {
      await homePage.deleteOpenPollCards();
      if (
        [
          'VotedPollWithCustomHash',
          'CreateAndBeginPollWithCustomHash',
          'CreatePollWithCustomHash',
        ].includes(pollType)
      ) {
        pollId = await homePage.createPoll(
          randomName,
          '1111111111111111111111111111111111111111111111111111111111111112'
        );
      } else {
        pollId = await homePage.createPoll();
      }

      if (
        pollType === 'CreateAndBeginPoll' ||
        pollType === 'CreateAndBeginPollWithCustomHash'
      ) {
        await homePage.beginVoteBtn.click();
      }
      if (pollType === 'VotedPoll' || pollType === 'VotedPollWithCustomHash') {
        await homePage.beginVoteBtn.click();

        const delegatePage = await newDelegate1Page(browser);
        const delegate2Page = await newDelegate2Page(browser);
        const delegate3Page = await newDelegate3Page(browser);

        const votes = [
          'vote-yes-button',
          'vote-no-button',
          'vote-abstain-button',
        ];
        pages = [delegatePage, delegate2Page, delegate3Page];

        await Promise.all(
          pages.map(async (userPage, index) => {
            const userPollPage = new PollPage(userPage);
            await userPollPage.goto(pollId);
            // cast vote
            await userPage.getByTestId(votes[index]).click();
            await expect(userPage.getByText('Vote recorded')).toBeVisible({
              timeout: 10_000,
            });
            await userPage.close();
          })
        );
        await organizerPollPage.goto(pollId);
        await organizerPollPage.endVoting();
      }
    }

    await use(pollId);

    await Promise.all(
      pages.map(async (userPage) => {
        userPage.close();
      })
    );
    // cleanup
    if (pollType !== 'NoAction' && pollType !== 'CreatePollWithoutTeardown') {
      await organizerPollPage.deletePoll();
    }
  },
});
