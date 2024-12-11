import { allure } from 'allure-playwright';
import { isMobile, isTablet } from './device';
import { chromium } from '@playwright/test';

export const setAllureEpic = async (groupName: string): Promise<void> => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  if (isMobile(page)) {
    await allure.epic('Mobile (Pixel 5)');
  } else if (isTablet(page)) {
    await allure.epic('Tablet (Galaxy Tab S4)');
  } else {
    await allure.epic('Desktop Chrome');
  }
  await allure.feature(groupName);
};

export const setAllureStory = async (groupName: string): Promise<void> => {
  await allure.story(groupName);
};
