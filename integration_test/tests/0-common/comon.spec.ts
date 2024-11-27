import { setAllureEpic } from '@helpers/allure';
import { expect, Locator, Page } from '@playwright/test';
import { test } from '@fixtures/poll';
import { forEachUser, getUserPages } from '@helpers/userRoles';
import path = require('path');
import fs = require('fs');
import { getCSVResults } from '@helpers/file';
import PollPage from '@pages/pollPage';
import {
  newDelegate1Page,
  newDelegate2Page,
  newDelegatePage,
  newOrganizer1Page,
  newOrganizerPage,
} from '@helpers/page';
import HomePage from '@pages/homePage';
import { delegateWallets, organizerWallets } from '@constants/staticWallets';
import { importWallet } from '@fixtures/importWallet';

test.beforeEach(async () => {
  await setAllureEpic('0. All Users');
});

test.describe('Polls', () => {
  test.use({
    pollType: 'CreateAndBeginPoll',
  }); //

  /**
   * Description: Anyone can see what stage in its lifecycle a poll is
   *
   * User Story: As an observer, I want to know whether a poll is pending, open or closed, so that I know what to expect
   *
   * Acceptance Criteria: Given that I am looking at a given poll, when I look at it, then I can see its status
   */
  test('0-1A-1. Given any user, can view poll status in home page', async ({
    browser,
    pollId,
  }) => {
    const pages = await getUserPages(browser);

    await Promise.all(
      pages.map(async (page) => {
        await page.goto('/');
        await page.waitForSelector('[data-testid^="poll-card-"]');

        const pollCards = page.locator('[data-testid^="poll-card-"]');

        const pollCardCount = await pollCards.count();
        expect(pollCardCount).toBeGreaterThan(0);

        // Check that each poll card has a 'poll-status-chip' with "Concluded" or "Pending"
        for (let i = 0; i < pollCardCount; i++) {
          const statusChip = pollCards
            .nth(i)
            .locator('[data-testid="poll-status-chip"]');

          await expect(statusChip).toBeVisible();

          const statusText = await statusChip.textContent();
          expect(['Concluded', 'Pending', 'Voting']).toContain(statusText);
        }
      })
    );
  });

  forEachUser((user) => {
    test(`0-1A-2. Given ${user.role} user, can view poll status in poll page`, async ({
      pollId,
      browser,
    }) => {
      const page = await user.loader(browser);
      await page.goto(`/polls/${pollId}`);

      const pollPageStatusChip = page.getByTestId('poll-page-status-chip');
      await expect(pollPageStatusChip).toBeVisible();

      const statusText = await pollPageStatusChip.textContent();
      expect(['Concluded', 'Pending', 'Voting']).toContain(statusText);
    });
  });

  /**
   * Description: All user types can see how many votes a poll has
   *
   * User Story: As any user, I want to see how many people have voted in a poll, so that I know whether the poll is near its conclusion
   *
   * Acceptance Criteria: Given that I am on the page of an open poll, When a user votes, I can see the counter increase by 1
   *
   */

  test('0-1C. All user types can see how many votes a poll has', async ({
    pollId,
    browser,
  }) => {
    test.slow();
    const pages = await getUserPages(browser);
    await Promise.all(
      pages.map(async (userPage) => {
        const pollPage = new PollPage(userPage);
        await pollPage.goto(pollId);
        const votes = await userPage
          .getByTestId('poll-page-vote-count')
          .innerText();
        expect(votes).toEqual('0 votes');
      })
    );

    const delegatePage = await newDelegatePage(browser, 2);
    const delegatePollPage = new PollPage(delegatePage);
    await delegatePollPage.goto(pollId);

    await delegatePollPage.voteYesBtn.click();
    await Promise.all(
      pages.map(async (userPage) => {
        const pollPage = new PollPage(userPage);
        await pollPage.goto(pollId);
        const votes = await userPage
          .getByTestId('poll-page-vote-count')
          .innerText();
        expect(votes).toEqual('1 vote');
      })
    );
  });
});

test.describe('Polls', () => {
  test.use({
    pollType: 'VotedPoll',
  });

  /**
   * Description: After a poll is closed the results of the poll should be displayed*
   *
   * User Story:
   * As an observer I want to know:
   *
   * How many yes, no & abstain votes there were
   * How many people didn't vote
   * The result
   * Who voted for what
   * ... when a poll is closed, so that I know the outcome
   *
   * Acceptance Criteria: Given that I am observing an open poll, when the poll is closed by a CO, then the results are displayed to me
   *
   * *results of a poll should never be displayed before the close of a poll
   */
  test('0-1B. Given any user, can view poll results', async ({
    browser,
    pollId,
  }) => {
    test.slow();
    const pages = await getUserPages(browser);

    await Promise.all(
      pages.map(async (page) => {
        await page.goto(`/polls/${pollId}`);
        const pollPageStatusChip = page.getByTestId('poll-page-status-chip');
        await expect(pollPageStatusChip).toBeVisible();

        await expect(page.getByTestId('results-yes')).toBeVisible();
        await page.getByTestId('results-no').isVisible();
        await page.getByTestId('results-abstain').isVisible();
        await page.goto(`/polls/${pollId}`);

        const yesCount = page.getByTestId('yes-count');
        const noCount = page.getByTestId('no-count');
        const abstainCount = page.getByTestId('abstain-count');

        // Assert the text content for each count
        await expect(yesCount).toHaveText('1');
        await expect(noCount).toHaveText('1');
        await expect(abstainCount).toHaveText('1');
      })
    );
  });

  /**
   * Description: On the results page of a poll there is currently a message that says Approved/Not Approved if the threshold of 50% yes votes is breached.
   * This needs to be changed so that the % of yes votes is shown.
   *
   * Acceptance Criteria: Given that I am an observer on the voting page of a poll, when a CO closes the poll, then the results page shows and instead of
   * saying "Approved"/ "Not Approved" it gives the % result*.
   */

  test('0-1D Given that I am an observer on the voting page of a poll then the results page shows % result ', async ({
    pollId,
    browser,
  }) => {
    const pages = await getUserPages(browser);

    await Promise.all(
      pages.map(async (page) => {
        const pollPage = new PollPage(page);
        await pollPage.goto(pollId);

        // Assert result in percentage
        const acceptancePercentage = await page
          .getByTestId('acceptance-percentage')
          .innerText();
        expect(acceptancePercentage).toEqual('2%');
      })
    );
  });
});

test.describe('User profile', () => {
  test.use({
    pollType: 'VotedPoll',
  });

  /**
   * Description: By going to the profile page of a delegate or alternate I can review their voting record
   *
   * User Story: As an observer I want to know how a given delegate or alternate has voted, so that I can examine their record
   *
   * Acceptance Criteria 1: Given that I am on the page listing delegates and alternates, when I press on a given delegate or alternate, then I will go to their profile page and see their voting record
   *
   * Acceptance Criteria 2: Given that I am on the results page of a closed poll, when I press on the tile of a given voter, then I am taken to their profile page and can see their voting record
   */
  test('0-2A-1. Given Delegate or alternate profile page, can view voting hsitory', async ({
    page,
    pollId,
    browser,
  }) => {
    test.slow();
    await page.goto('/polls/' + pollId);

    const buttons = await page
      .locator('[data-testid^="representative-vote-"]')
      .all();

    if (buttons.length === 0) {
      throw new Error('No representative vote buttons found');
    }
    const pages: Page[] = [];
    for (const button of buttons) {
      const testId = await button.getAttribute('data-testid');
      console.log(`Opening new tab for button with test id: ${testId}`);

      // Get the href attribute or construct the URL for navigation
      const href = await button.getAttribute('href');
      if (!href) {
        throw new Error(
          `Button with test id: ${testId} does not have an href attribute`
        );
      }

      // Open a new tab
      const newPage = await browser.newPage();
      await newPage.goto(href);
      console.log(`Opened new tab for: ${href}`);

      pages.push(newPage);
    }
    await Promise.all(
      pages.map(async (voterPage) => {
        const votingTable = voterPage.getByTestId('voting-history-table');
        await votingTable.getByTestId('user-votes-' + pollId).isVisible();
      })
    );
  });

  /**
   * Description: By going to the profile page of a delegate or alternate I can review their voting record
   *
   * User Story: As an observer I want to know how a given delegate or alternate has voted, so that I can examine their record
   *`
   * Acceptance Criteria 1: Given that I am on the page listing delegates and alternates, when I press on a given delegate or alternate, then I will go to their profile page and see their voting record
   *
   * Acceptance Criteria 2: Given that I am on the results page of a closed poll, when I press on the tile of a given voter, then I am taken to their profile page and can see their voting record
   */

  test('0-2A-2. Can navigate to user profile from delegate/alternate listing page', async ({
    page,
  }) => {
    await page.goto('/');
    const table = page.getByTestId('representatives-table');
    await expect(table.getByTestId('alternate-name-138')).toBeVisible();
    // Locate the buttons
    const delegates = await table
      .locator('[data-testid^="delegate-name-"]')
      .all();

    const alternates = await table
      .locator('[data-testid^="alternate-name-"]')
      .all();

    await Promise.all(
      [...delegates, ...alternates].map(async (rep: Locator) => {
        const href = await rep.getAttribute('href');
        expect(href).toMatch(/^\/representatives\/(\d+|null)$/);
      })
    );
    // should navigate to /representatives/xx
  });

  test('0-2A-3. Can navigate to user profile from voter view in poll results page', async ({
    page,
    pollId,
  }) => {
    await page.goto('polls/' + pollId);

    // Locate the buttons
    const buttons = await page
      .locator('[data-testid^="representative-vote-"]')
      .all();

    if (buttons.length === 0) {
      throw new Error('No representative vote buttons found');
    }

    // Click the first button
    await buttons[0].click();

    await page.waitForURL(/\/representatives\/\d+$/);
  });
});

/**
 * Description: All the results of voting, information about the voter, and how they voted should be downloadable in csv format at any time.
 *
 * User Story: As an Obsever I want to download the results in CSV format so that I can audit them
 *
 * Acceptance Criteria: Given that I am on the page of a delegate or alternate, when I click "Download Votes" button then a CSV of my voting history is downloaded to my device.
 *
 */

test.describe('CSV File', () => {
  test.use({ pollType: 'VotedPoll' });
  // pollId is used only for creation of votedPolls
  test('0-3A. Can download CSV of voting history', async ({
    browser,
    pollId,
  }) => {
    test.slow();
    const pages = await getUserPages(browser);
    await Promise.all(
      pages.map(async (page, index) => {
        await page.goto('/representatives/13');
        // Trigger the download
        const [download] = await Promise.all([
          page.waitForEvent('download'), // Wait for the download event
          await expect(page.getByTestId('download-user-votes-btn')).toBeVisible(
            { timeout: 10_000 }
          ),
          await page.getByTestId('download-user-votes-btn').click(),
        ]);

        // Save the downloaded file
        const filePath = path.join(
          __dirname,
          `convention_voting_app_${index}.csv`
        );
        await download.saveAs(filePath);

        // Verify the file exists
        expect(fs.existsSync(filePath)).toBeTruthy();

        // fetch csv results
        const pollResults = await getCSVResults(filePath);

        // assert vote result
        expect(pollResults[0].poll).toBeTruthy();
        expect(['yes', 'no', 'abstain']).toContain(pollResults[0].vote);

        // Clean up (optional)
        fs.unlinkSync(filePath);
      })
    );
  });
});

test.describe('Constitution Poll Hash', () => {
  test.describe('Pending Poll', () => {
    test.use({ pollType: 'CreatePollWithCustomHash' });
    test('0-4A-1 Observers should be able to view custom hash of pending poll', async ({
      pollId,
      browser,
    }) => {
      test.slow();
      const pages = await getUserPages(browser);
      await Promise.all(
        pages.map(async (page) => {
          const pollPage = new PollPage(page);
          await pollPage.goto(pollId);

          // fetch hash value
          const pollPageHash = page.getByTestId('constitution-poll-hash');
          await expect(pollPageHash.first()).toBeVisible({ timeout: 20_000 });
          const pollPageHashContent = await pollPageHash.innerText();

          // assert hash value
          expect(pollPageHashContent).toContain(
            '1111111111111111111111111111111111111111111111111111111111111112'
          );
        })
      );
    });
  });

  test.describe('On Going Poll', () => {
    test.use({ pollType: 'CreateAndBeginPollWithCustomHash' });
    test('0-4A-2 Observers should be able to view custom hash of ongoing poll', async ({
      pollId,
      browser,
    }) => {
      test.slow();
      const pages = await getUserPages(browser);
      await Promise.all(
        pages.map(async (page) => {
          const pollPage = new PollPage(page);
          await pollPage.goto(pollId);

          // fetch hash value
          const pollPageHash = page.getByTestId('constitution-poll-hash');
          await expect(pollPageHash.first()).toBeVisible({ timeout: 20_000 });
          const pollPageHashContent = await pollPageHash.innerText();

          // Assert hash value
          expect(pollPageHashContent).toContain(
            '1111111111111111111111111111111111111111111111111111111111111112'
          );
        })
      );
    });
  });

  test.describe('Voted Poll', () => {
    test.use({ pollType: 'VotedPollWithCustomHash' });
    test('0-4A-2 Observers should be able to view custom hash of voted poll', async ({
      pollId,
      browser,
    }) => {
      test.slow();
      const pages = await getUserPages(browser);
      await Promise.all(
        pages.map(async (page) => {
          const pollPage = new PollPage(page);
          await pollPage.goto(pollId);

          // Fetch Hash value
          const pollPageHash = page.getByTestId('constitution-poll-hash');
          await expect(pollPageHash.first()).toBeVisible({ timeout: 20_000 });
          const pollPageHashContent = await pollPageHash.innerText();

          // Assert hash value
          expect(pollPageHashContent).toContain(
            '1111111111111111111111111111111111111111111111111111111111111112'
          );
        })
      );
    });
  });
});

test.describe('Wallet switching', () => {
  test.use({
    storageState: '.auth/organizer1.json',
    wallet: organizerWallets[0],
  });
  test('0-5A Update Wallet and Role After Switching Wallets in Extension', async ({
    page,
  }) => {
    test.slow();
    await page.goto('/');

    //click connect wallet button to view representative name
    const connectWalletButton = page
      .getByTestId('connect-wallet-button')
      .first();
    await connectWalletButton.click();

    // Assert representative name
    await expect(page.getByTestId('disconnect-wallet')).toBeVisible();
    const user = await page.getByTestId('representative-name').innerText();
    expect(user).toEqual('Test organizer 02');

    // Change wallet
    const wallet = delegateWallets[0];
    await importWallet(page, wallet);

    // Assert disconnection
    await page.goto('/');

    await expect(page.getByTestId('connect-wallet-button').first()).toBeVisible(
      { timeout: 10_000 }
    );
    await page.getByTestId('connect-wallet-button').first().click();
    await page.waitForLoadState('load');

    await expect(page.getByTestId('connect-wallet-button').first()).toBeVisible(
      { timeout: 10_000 }
    );
    await page.getByTestId('connect-wallet-button').first().click();
    await expect(page.getByTestId('connect-wallet-Eternl')).toBeVisible({
      timeout: 10_000,
    });
  });
});
