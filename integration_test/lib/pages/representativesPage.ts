import { Page, expect } from '@playwright/test';

const representativeUpdatedToast = 'User info updated!';
export default class RepresentativesPage {
  readonly transferVotingPowerBtn = this.page.getByTestId(
    'edit-active-voter-1'
  );
  readonly saveUpdatedVotingPowerBtn = this.page.getByTestId(
    'save-active-voter-1'
  );
  readonly editUserProfileBtn = this.page.getByTestId(
    'edit-representative-info-138'
  );
  readonly saveUserProfileBtn = this.page.getByTestId(
    'save-representative-info-138'
  );

  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/representatives/manage');
  }

  async updateUserProfile(
    name: string,
    email: string,
    stake_address: string
  ): Promise<void> {
    await this.goto();
    await expect(this.editUserProfileBtn).toBeVisible({ timeout: 30_000 });
    await this.editUserProfileBtn.click();
    await this.page
      .getByRole('textbox')
      .nth(0)
      .fill('A' + name);
    await this.page.getByRole('textbox').nth(1).fill(email);
    await this.page.getByRole('textbox').nth(2).fill(stake_address);
    await this.saveUserProfileBtn.click({ force: true });
  }

  async isRepresentativeUpdated(infos: Array<string>): Promise<void> {
    await expect(this.page.getByText(representativeUpdatedToast)).toBeVisible();
    await expect(this.editUserProfileBtn).toBeVisible({ timeout: 30_000 });
    await Promise.all(
      infos.map(
        async (info) =>
          await expect(this.page.getByText(info, { exact: true }).first()).toBeVisible()
      )
    );
  }

  async switchVotingPower(workshopId = 1): Promise<void> {
    await this.goto();
    await this.page.getByTestId(`edit-active-voter-${workshopId}`).click();
    const currentActiveVoter = await this.page
      .locator(`[data-id="${workshopId}"]`)
      .getByRole('combobox')
      .innerText();
    await this.page
      .locator(`[data-id="${workshopId}"]`)
      .getByRole('combobox')
      .click();
    await this.page
      .getByRole('option', {
        name: currentActiveVoter === 'Delegate' ? 'Alternate' : 'Delegate',
      })
      .click({ force: true });
    await this.page.getByTestId(`save-active-voter-${workshopId}`).click();
  }

  async assertSwitchedVotingPower(workshopId = 1): Promise<void> {
    await expect(this.page.getByRole('row').first()).toBeVisible();
    const activeVoterRole = await this.getActiveVoterStatus();
    await this.page
      .locator(`[data-id="${workshopId}"]`)
      .filter({ has: this.page.getByTestId(`edit-active-voter-${workshopId}`) })
      .locator(`[data-testid^="${activeVoterRole.toLowerCase()}-name-"]`)
      .click({ force: true });
    await expect(this.page.locator('.MuiChip-root').first()).toHaveText(
      'Active Voter'
    );
  }

  async getActiveVoterStatus(workshopId = 1): Promise<string> {
    return await this.page
      .locator(`[data-id="${workshopId}"]`)
      .locator('[data-field="active_voter_id"]')
      .innerText();
  }

  async getRepresentativeId(isDelegate: boolean = false): Promise<string> {
    await expect(this.page.getByRole('row').first()).toBeVisible();
    await expect(
      this.page
        .locator('[data-id="1"]')
        .filter({ has: this.page.getByTestId('edit-active-voter-1') })
        .locator(
          `[data-testid^="${isDelegate ? 'delegate' : 'alternate'}-name-"]`
        )
    ).toBeVisible();
    const representativeTestId = await this.page
      .locator('[data-id="1"]')
      .filter({ has: this.page.getByTestId('edit-active-voter-1') })
      .locator(
        `[data-testid^="${isDelegate ? 'delegate' : 'alternate'}-name-"]`
      )
      .getAttribute('data-testid');
    return representativeTestId.split('-').pop();
  }

  async getActiveVoterId(workshopId = 1): Promise<string> {
    await expect(
      this.page
        .locator(`[data-id="${workshopId}"]`)
        .locator('[data-field="active_voter_cell"]')
    ).toBeVisible();
    return await this.page
      .locator(`[data-id="${workshopId}"]`)
      .locator('[data-field="active_voter_cell"]')
      .getAttribute('data-testid');
  }
}
