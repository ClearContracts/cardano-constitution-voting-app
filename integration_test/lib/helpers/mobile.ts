import { Page } from '@playwright/test';

export function isMobile(page: Page): boolean {
  const { width } = page.viewportSize();
  if (width <= 414) return true;

  return false;
}
