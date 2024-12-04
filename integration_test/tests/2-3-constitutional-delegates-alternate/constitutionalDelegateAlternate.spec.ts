import { setAllureEpic } from '@helpers/allure';
import { test } from '@fixtures/poll';
import PollPage from '@pages/pollPage';
import { Browser, expect, Page } from '@playwright/test';
import RepresentativesPage from '@pages/representativesPage';
import {
  newAlternatePage,
  newDelegatePage,
  newOrganizerPage,
} from '@helpers/page';
import { upperCaseFirstLetter } from '@helpers/string';
import { isMobile, isTablet } from '@helpers/device';

const switchVotingPowerAndBeginPoll = async (
  user: string,
  organizerPage: Page,
  pollId: number,
  isPendingPoll: boolean = false
) => {
  const representativePage = new RepresentativesPage(organizerPage);
  await representativePage.goto();
  const activeUser = await representativePage.getActiveVoterStatus(5);
  if (activeUser.toLowerCase() !== user) {
    await representativePage.switchVotingPower(5);
    await organizerPage.waitForTimeout(10_000);
  }

  if (!isPendingPoll) {
    const organizerPollPage = new PollPage(organizerPage);
    await organizerPollPage.goto(pollId);
    await organizerPollPage.beginVoteBtn.click();
  }
};

const revertVotingPower = async (
  organizerPage: Page,
  pollId: number,
  user: string
) => {
  const pollPage = new PollPage(organizerPage);
  await pollPage.goto(pollId);
  await pollPage.deletePollBtn.click();

  const representativePage = new RepresentativesPage(organizerPage);
  await representativePage.goto();
  const activeUser = await representativePage.getActiveVoterStatus(5);
  if (activeUser.toLowerCase() === 'alternate') {
    await representativePage.switchVotingPower(5);
  }
};

const setupUserAndPollPage = async (
  user: string,
  browser: Browser,
  pollId: number
): Promise<{ pollPage: PollPage; userPage: Page }> => {
  const userPage =
    user === 'delegate'
      ? await newDelegatePage(browser, 3)
      : await newAlternatePage(browser, 3);

  const pollPage = new PollPage(userPage);
  await pollPage.goto(pollId);

  return { pollPage, userPage };
};

test.describe('Vote', () => {
  test.use({
    pollType: 'CreatePollWithoutTeardown',
  });
  const users = ['delegate', 'alternate'];
  users.forEach((user, index) => {
    test.describe(`User: ${user}`, () => {
      let currentPollId: number;
      let organizerPage: Page;
      let pollPage: PollPage;
      let userPage: Page;

      test.afterEach(async () => {
        await revertVotingPower(organizerPage, currentPollId, user);
      });

      test.describe('Voting poll', () => {
        test.beforeEach(async ({ pollId, browser }) => {
          await setAllureEpic(
            `${index + 2}. Constitutional ${upperCaseFirstLetter(user)}`
          );

          currentPollId = pollId;
          organizerPage = await newOrganizerPage(browser, 0);
          await switchVotingPowerAndBeginPoll(user, organizerPage, pollId);
          ({ pollPage, userPage } = await setupUserAndPollPage(
            user,
            browser,
            pollId
          ));
        });

        /**
         * Description: voters are the only people who can vote, and they can only vote in a poll that is open
         *
         * User Story: As an eligible delegate or alternate, I want to be able to vote in open polls, so that I can represent the interests of my workshop
         *
         * Acceptance Criteria: Given that I am on the page of an open poll when I look at it, then I see that I have the option to vote*
         *
         * *conversely votes that are 'closed' or 'pending' do not give voters the option to vote.
         */

        test(`${index + 2}-1A. Given active ${user}, and poll is open, then vote option should be visible`, async () => {
          test.slow();
          await expect(pollPage.voteYesBtn).toBeVisible({ timeout: 10_000 }),
            await Promise.all([
              await expect(pollPage.voteYesBtn).toBeVisible(),
              await expect(pollPage.voteNoBtn).toBeVisible(),
              await expect(pollPage.voteAbstainBtn).toBeVisible(),
            ]);
        });

        /**
         * Description: If a voter has already voted on a poll that is currently open then they will be able to change their vote
         *
         * User Story: As a voter, I want to be able to change my vote before the poll is closed, so that I can be sure that I made the right choice
         *
         * Acceptance Criteria: Given that I am a voter on the page of an open poll and I have already voted, when I vote again, then my vote is counted.
         */
        test(`${index + 2}-1C. Given active ${user}, and poll is open, can update casted vote`, async () => {
          test.slow();
          //  yes vote
          await pollPage.voteYesBtn.click();
          await expect(userPage.getByTestId('poll-page-vote-count')).toHaveText(
            '1 vote',
            { timeout: 10_000 }
          );

          // change vote
          await pollPage.voteNoBtn.click();

          await expect(userPage.getByTestId('vote-status')).toHaveText('NO');
          await expect(userPage.getByTestId('poll-page-vote-count')).toHaveText(
            '1 vote',
            { timeout: 10_000 }
          );
        });

        /**
         * Voters can see how they themselves have voted
         */

        test(`${index + 2}-1F. Given active ${user}, can see what they have voted`, async () => {
          test.slow();
          //  yes vote
          await pollPage.voteYesBtn.click();
          await expect(userPage.getByTestId('vote-status')).toHaveText('YES', {
            timeout: 10_000,
          });
        });

        /**
         * Description: voters can choose not to vote
         *
         * User Story: As a voter I want to be able to choose not to vote, so that the app does not break if I don't
         *
         * Acceptance Criteria: Given that I am a voter, when I choose not to vote, then there is no effect.
         */

        test(`${index + 2}-1D. Given active ${user}, can choose not to vote`, async () => {
          test.slow();
          await pollPage.voteAbstainBtn.click();

          await expect(userPage.getByTestId('vote-status')).toHaveText(
            'ABSTAIN'
          );
          await expect(userPage.getByTestId('poll-page-vote-count')).toHaveText(
            '1 vote',
            { timeout: 10_000 }
          );
        });

        /**
         * Description: One delegate or alternate from each workshop is chosen to be eligible to vote (a 'voter'), this voter can vote "yes", "no", or "abstain" in any open poll
         *
         * User Story: As a voter, I want to vote either "yes", "no", or "abstain" in an open poll, so that I can represent my workshop
         *
         * Acceptance Criteria: Given that I am a voter on the page of an open poll, when I press to vote either "yes", "no", or "abstain", then my the CVT sends a vote message to my wallet to be signed.
         */

        test(`${index + 2}-1E: Active ${user} should be able to vote Yes, No, or Abstain on a poll`, async () => {
          test.slow();
          // yes vote
          await pollPage.voteYesBtn.click();
          await expect(userPage.getByTestId('vote-status')).toHaveText('YES');
          await expect(userPage.getByTestId('poll-page-vote-count')).toHaveText(
            '1 vote',
            { timeout: 10_000 }
          );

          // no vote
          await pollPage.voteNoBtn.click();
          await expect(userPage.getByTestId('vote-status')).toHaveText('NO');
          await expect(userPage.getByTestId('poll-page-vote-count')).toHaveText(
            '1 vote',
            { timeout: 10_000 }
          );

          // abstain vote
          await pollPage.voteAbstainBtn.click();
          await expect(userPage.getByTestId('vote-status')).toHaveText(
            'ABSTAIN'
          );
          await expect(userPage.getByTestId('poll-page-vote-count')).toHaveText(
            '1 vote',
            { timeout: 10_000 }
          );
        });
      });

      test.describe('Pending Poll', () => {
        test.beforeEach(async ({ pollId, browser }) => {
          await setAllureEpic(
            `${index + 2}. Constitutional ${upperCaseFirstLetter(user)}`
          );

          currentPollId = pollId;
          organizerPage = await newOrganizerPage(browser, 0);
          await switchVotingPowerAndBeginPoll(
            user,
            organizerPage,
            pollId,
            true
          );

          ({ pollPage, userPage } = await setupUserAndPollPage(
            user,
            browser,
            pollId
          ));
        });

        /**
         * Description: voters are the only people who can vote, and they can only vote in a poll that is open
         *
         * User Story: As an eligible delegate or alternate, I want to be able to vote in open polls, so that I can represent the interests of my workshop
         *
         * Acceptance Criteria: Given that I am on the page of an open poll when I look at it, then I see that I have the option to vote*
         *
         * *conversely votes that are 'closed' or 'pending' do not give voters the option to vote.
         */

        test(`${index + 2}-1B. Given active ${user} and the poll is pending, voting should be disallowed`, async () => {
          await expect(
            userPage.getByTestId('poll-page-status-chip').getByText('Pending')
          ).toBeVisible({ timeout: 10_000 });
          await expect(pollPage.voteYesBtn).not.toBeVisible();
          await expect(pollPage.voteNoBtn).not.toBeVisible();
          await expect(pollPage.voteAbstainBtn).not.toBeVisible();
        });
      });
    });
  });
});

test.describe('Representative Status', () => {
  const users = ['delegate', 'alternate'];
  users.forEach((user, index) => {
    test.describe('Representative Status', () => {
      test.beforeEach(async () => {
        await setAllureEpic(
          `${index + 2}. Constitutional ${upperCaseFirstLetter(user)}`
        );
      });

      /**
       * Description: Delegates and Voters can see whether or not they have been assigned voting rights
       *
       * User Story: As a delegate or alternate, I want to be able to see whether I am able to vote
       *
       * Acceptance Criteria:
       *
       */

      test(`${index + 2}-1G. Once login ${user} should be able to know their voting right status`, async ({
        browser,
      }) => {
        const delegatePage = await newDelegatePage(browser, 3);
        const alternatePage = await newAlternatePage(browser, 3);

        const pages = user === 'delegate' ? [delegatePage] : [alternatePage];

        await Promise.all(
          pages.map(async (page) => {
            await page.goto('/');

            if (isMobile(page) || isTablet(page)) {

              // Click representative group and fetch representative list
              const testDelegator3GroupDropDownBtn = page.getByTestId('test-delegate-05-group-button')
              const testDelegator3Group = page.getByTestId('test-delegate-05-group')
              await expect(testDelegator3GroupDropDownBtn).toBeVisible({ timeout: 10_000 })
              await testDelegator3GroupDropDownBtn.click();

              await expect(testDelegator3Group.locator('[data-testid^="alternate-name-"]').first()).toBeVisible({ timeout: 10_000 });
              const representativeDetails = (await testDelegator3Group.allInnerTexts())[0].split('\n')
              const [delegate, alternate, workshop, activeVoter] = representativeDetails.filter((r, index) => index % 2 != 0)

              // Assert workshop name
              expect(workshop).toBe('Workshop 05');

              // Assert active voter value to be in between delegate and alternate
              expect(['Delegate', 'Alternate']).toContain(activeVoter);

            } else {
              await expect(page.locator('[data-id="5"]').first()).toBeVisible({
                timeout: 10_000,
              });

              // Fetch representative list of workshop 5
              const representativeList = await page
                .locator('[data-id="5"]')
                .allInnerTexts();
              const [workshop, delegate, alternate, active_voter] =
                representativeList[0].split('\n\n');

              // Assert workshop name
              expect(workshop).toBe('Workshop 05');

              // Assert active voter value to be in between delegate and alternate
              expect(['Delegate', 'Alternate']).toContain(active_voter);
            }

          })
        );
      });
    });
  });
});
