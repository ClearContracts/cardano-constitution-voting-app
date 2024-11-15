import { setAllureEpic } from '@helpers/allure';
import { test } from '@fixtures/poll';
import { delegateWallet } from '@constants/staticWallets';
import PollPage from '@pages/pollPage';
import { expect } from '@playwright/test';

test.beforeEach(async () => {
  await setAllureEpic('2. Constitutional Delegates');
});

test.use({
  storageState: '.auth/delegate.json',
  wallet: delegateWallet,
});

test.describe('Vote', () => {
  test.describe('  poll', () => {
    test.use({
      pollType: 'CreateAndBeginPoll',
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
    test('2-1A. Given active delegate, and poll is open, then vote option should be visible', async ({
      page,
      pollId,
    }) => {
      const pollPage = new PollPage(page);
      await pollPage.goto(pollId);

      await expect(pollPage.voteYesBtn).toBeVisible();
      await expect(pollPage.voteNoBtn).toBeVisible();
      await expect(pollPage.voteAbstainBtn).toBeVisible();
    });

    /**
     * Description: If a voter has already voted on a poll that is currently open then they will be able to change their vote
     *
     * User Story: As a voter, I want to be able to change my vote before the poll is closed, so that I can be sure that I made the right choice
     *
     * Acceptance Criteria: Given that I am a voter on the page of an open poll and I have already voted, when I vote again, then my vote is counted.
     */
    test('2-1C. Given active delegate, and poll is open, can update casted vote', async ({
      page,
      pollId,
    }) => {
      const pollPage = new PollPage(page);
      await pollPage.goto(pollId);
      //  yes vote
      await pollPage.voteYesBtn.click();
      await expect(page.getByText('Yes', { exact: true })).toBeVisible();

      // change vote
      await pollPage.voteNoBtn.click();

      await expect(page.getByText('No', { exact: true })).toBeVisible();
      await expect(page.getByText('1 vote', { exact: true })).toBeVisible(); // missing test id
    });

    /**
     * Description: voters can choose not to vote
     *
     * User Story: As a voter I want to be able to choose not to vote, so that the app does not break if I don't
     *
     * Acceptance Criteria: Given that I am a voter, when I choose not to vote, then there is no effect.
     */

    test('2-1D. Given active delegate, can choose not to vote', async ({
      page,
      pollId,
    }) => {
      const pollPage = new PollPage(page);
      await pollPage.goto(pollId);
      await pollPage.voteAbstainBtn.click();

      await expect(page.getByText('Abstain', { exact: true })).toBeVisible();
      await expect(page.getByText('1 vote', { exact: true })).toBeVisible(); // missing test id
    });

    /**
     * Description: One delegate or alternate from each workshop is chosen to be eligible to vote (a 'voter'), this voter can vote "yes", "no", or "abstain" in any open poll
     *
     * User Story: As a voter, I want to vote either "yes", "no", or "abstain" in an open poll, so that I can represent my workshop
     *
     * Acceptance Criteria: Given that I am a voter on the page of an open poll, when I press to vote either "yes", "no", or "abstain", then my the CVT sends a vote message to my wallet to be signed.
     */

    test('2-1E: Active Delegate Should Be Able to Vote Yes, No, or Abstain on a Poll', async ({
      page,
      pollId,
    }) => {
      const pollPage = new PollPage(page);
      await pollPage.goto(pollId);

      // yes vote
      await pollPage.voteYesBtn.click();
      await expect(page.getByText('Yes', { exact: true })).toBeVisible();
      await expect(page.getByText('1 vote', { exact: true })).toBeVisible(); // missing test id

      // no vote
      await pollPage.voteNoBtn.click();
      await expect(page.getByText('No', { exact: true })).toBeVisible();
      await expect(page.getByText('1 vote', { exact: true })).toBeVisible(); // missing test id

      // abstain vote
      await pollPage.voteAbstainBtn.click();
      await expect(page.getByText('Abstain', { exact: true })).toBeVisible();
      await expect(page.getByText('1 vote', { exact: true })).toBeVisible(); // missing test id
    });
  });

  test.describe('Pending poll', () => {
    test.use({
      pollType: 'CreatePoll',
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

    test('2-1B. Given active delegate and the poll is pending, voting should be disallowed', async ({
      page,
      pollId,
    }) => {
      const pollPage = new PollPage(page);
      await pollPage.goto(pollId);

      await expect(pollPage.voteYesBtn).not.toBeVisible();
      await expect(pollPage.voteNoBtn).not.toBeVisible();
      await expect(pollPage.voteAbstainBtn).not.toBeVisible();
    });
  });
});
