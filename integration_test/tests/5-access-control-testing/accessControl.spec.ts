import { newOrganizer1Page } from '@helpers/page';
import { getUserPages } from '@helpers/userRoles';
import test, { expect, Page } from '@playwright/test';
import HomePage from '@pages/homePage';
import { setAllureEpic } from '@helpers/allure';
import {
  createPoll,
  deletePoll,
  updateActiveVoter,
  updateUser,
} from '@helpers/accessControl';

test.beforeEach(async () => {
  await setAllureEpic('5. Access Control');
});

test.describe('Access Control Test', () => {
  test.describe('Poll', () => {
    test.beforeEach(async ({ browser }) => {
      const organizerPage = await newOrganizer1Page(browser);
      const homePage = new HomePage(organizerPage);
      await homePage.goto();
      await homePage.deleteOpenPollCards();
    });

    test('5-1A. Only CO can create a new poll', async ({ browser }) => {
      const userPages = await getUserPages(browser);

      // Fetch Organizer page only
      const organizerPage = userPages.shift();

      // Assert poll creation for the organizer
      const organizerPollRes = await createPoll(organizerPage);
      expect(organizerPollRes).toBeOK();

      // Assert unauthorized for poll creation for other user
      await Promise.all(
        userPages.map(async (page) => {
          const pollRes = await createPoll(page);
          await expect(pollRes).not.toBeOK();
        })
      );
    });

    test('5-1B. Only CO can Open Poll', async ({ browser }) => {
      const userPages = await getUserPages(browser);

      // Get organizer and create a new poll
      const organizerPage = userPages.shift();
      const organizerPollRes = await createPoll(organizerPage);

      // Setup pollId
      const pollId = (await organizerPollRes.json()).pollId;

      // Assert unauthorized for deletion of poll for users other than organizer
      await Promise.all(
        userPages.map(async (page, index) => {
          const pollRes = await deletePoll(page, pollId);
          await expect(pollRes).not.toBeOK();
        })
      );

      // Assert Ok for deletion of poll for organizer
      const pollRes = await deletePoll(organizerPage, pollId);
      expect(pollRes).toBeOK();
    });
  });

  test.describe('User Management', () => {
    test('5-2A. Only CO can update User Profile', async ({ browser }) => {
      const userPages = await getUserPages(browser);

      // Fetch Organizer page only
      const organizerPage = userPages.shift();

      // Assert update user profile for the organizer
      const organizerUpdateRes = await updateUser(organizerPage);
      expect(organizerUpdateRes).toBeOK();

      // Assert unauthorized for updating user profile for other users
      await Promise.all(
        userPages.map(async (page) => {
          const updateRes = await updateUser(page);
          await expect(updateRes).not.toBeOK();
        })
      );
    });

    test('5-2B. Only CO can update Active Voter', async ({ browser }) => {
      const userPages = await getUserPages(browser);

      // Fetch Organizer page only
      const organizerPage = userPages.shift();

      // Assert update active user profile for the organizer
      const organizerUpdateRes = await updateActiveVoter(organizerPage);
      expect(organizerUpdateRes).toBeOK();

      // Assert unauthorized for update active voter for other users
      await Promise.all(
        userPages.map(async (page) => {
          const updateRes = await updateActiveVoter(page);
          await expect(updateRes).not.toBeOK();
        })
      );
    });
  });
});
