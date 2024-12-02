import { Page, expect } from '@playwright/test';

export default class LoginPage {
  readonly connectWalletBtn = this.page.getByTestId('connect-wallet-button');
  readonly eternlWalletBtn = this.page.getByTestId('connect-wallet-Eternl');
  readonly disconnectWalletBtn = this.page.getByTestId('disconnect-wallet');

  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(): Promise<void> {
    await this.goto();

    await this.connectWalletBtn.first().click();
    await this.eternlWalletBtn.click({ force: true });
    // this is taking absurdly long time when testing with 10 parallel users
    await expect(this.page.getByTestId('connected-user-name')).toBeVisible({timeout: 40000})
  }

  async logout(): Promise<void> {
    await this.connectWalletBtn.first().click();
    await this.disconnectWalletBtn.click();
  }

  async isLoggedIn(): Promise<void> {
    await expect(this.page.getByTestId('connected-user-name')).toBeVisible({timeout: 40000})
  }
}
