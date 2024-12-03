import { expect, Locator, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { extractPollIdFromUrl } from '@helpers/string';
import { blake } from 'libcardano';
import PollPage from './pollPage';
import Logger from '@helpers/logger';

export default class HomePage {
  readonly heading = this.page.getByText(
    'Welcome to the Constitutional Convention Voting Tool'
  );
  // btn
  readonly createPollBtn = this.page.getByTestId('create-poll-button').first();
  readonly submitPollBtn = this.page.getByTestId('create-poll-button'); //BUG incorrect testid
  readonly beginVoteBtn = this.page.getByTestId('begin-vote-button');

  // input
  readonly pollNameInput = this.page.locator(
    '[data-testid="poll-name-input"] textarea'
  ).first();

  readonly constitutionLinkInput = this.page
    .locator('[data-testid="poll-link-input"] input')
    .first();

  readonly constutionHashInput = this.page
    .locator('[data-testid="poll-constitution-text-input"] input')
    .first();

  readonly pollCard = this.page.locator('[data-testid^="poll-card-"]');

  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async createPoll(
    pollName = faker.commerce.productName() || 'default',
    pollHash: string = ''
  ): Promise<number> {
    await this.createPollBtn.click();
    await this.page.waitForSelector('[data-testid="poll-name-input"] textarea');
    await this.pollNameInput.fill(pollName);
    await this.constitutionLinkInput.fill(faker.internet.url());
    const randomHash = blake.hash32(Buffer.from(faker.animal.bear()));
    await this.constutionHashInput.fill(
      pollHash ? pollHash : randomHash.toString('hex')
    );

    await this.submitPollBtn.click();

    await expect(this.beginVoteBtn).toBeVisible({
      timeout: 30_000,
    });
  
    const currentPageUrl = this.page.url();
    Logger.info("Current page Url: " + currentPageUrl);
  
    const pollId = extractPollIdFromUrl(currentPageUrl);
  
    // Return the extracted poll ID
    return pollId;
  }

  async getOpenPollCard(): Promise<Locator> {
    await this.page.waitForTimeout(1_000);
    const pollCards = await this.pollCard.all();
    if (pollCards.length > 0) {
      for (const pollCard of pollCards) {
        const pollCardInnerTexts = await pollCard.innerText();
        if (
          pollCardInnerTexts.includes('Voting') ||
          pollCardInnerTexts.includes('Pending')
        ) {
          return pollCard;
        }
      }
    }
  }

  async deleteOpenPollCards(): Promise<boolean> {
    const openPollCard = await this.getOpenPollCard();
    if (openPollCard) {
      await openPollCard.click();
      const pollPage=new PollPage(this.page)
      await pollPage.deletePoll()
      return true;
    }
    return false;
  }
}
