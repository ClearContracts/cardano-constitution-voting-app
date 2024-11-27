import { organizerWallets } from '@constants/staticWallets';
import { importWallet } from '@fixtures/importWallet';
import loadEternlExtension from '@fixtures/loadExtension';
import {
  newDelegatePage,
  newOrganizer1Page,
  newOrganizerPage,
} from '@helpers/page';
import { getUserPages } from '@helpers/userRoles';
import test, { BrowserContext, expect, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import HomePage from '@pages/homePage';

const UserAuthFiles = [
  '.auth/organizer1.json',
  '.auth/delegate1.json',
  '.auth/alternate1.json',
];

const customHeader = { 'X-Custom-Header': 'intersect' };

async function deletePoll(page: Page, pollId: number) {
  const res = await page.request.post('/api/archivePoll', {
    headers: customHeader,
    data: {
      pollId: pollId,
    },
  });
  return res;
}

async function createPoll(page: Page) {
  const body = {
    name: faker.person.firstName(),
    hashedText: faker.person.lastName(),
    link: faker.internet.url(),
  };
  const res = await page.request.post('/api/newPoll', {
    headers: {
      'X-Custom-Header': 'intersect',
    },
    data: body,
  });
  return res;
}

async function updateUser(page: Page, userId: string = '138') {
  const body = {
    userId: userId,
    name: faker.person.firstName(),
    email: faker.person.firstName() + '@gmail.com',
    wallet_address: faker.person.lastName(),
  };
  const res = await page.request.post('/api/updateUser', {
    headers: {
      'X-Custom-Header': 'intersect',
    },
    data: body,
  });
  return res;
}

async function updateActiveVoter(
  page: Page,
  workshopId: string = '63',
  activeVoterId: string = '138'
) {
  const body = { workshopId: workshopId, activeVoterId: activeVoterId };
  const res = await page.request.post('/api/updateActiveVoter', {
    headers: {
      'X-Custom-Header': 'intersect',
    },
    data: body,
  });
  return res;
}

test.describe('Access Control Test', () => {
  test.describe('Poll', () => {
    test.beforeEach(async ({ browser }) => {
      const organizerPage = await newOrganizer1Page(browser);
      const homePage = new HomePage(organizerPage);
      await homePage.goto();
      await homePage.deleteOpenPollCards();
    });

    test('Creating New Poll', async ({ browser }) => {
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

    test('Delete Open Poll', async ({ browser }) => {
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
    test('Update User Profile', async ({ browser }) => {
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

    test('Update Active Voter', async ({ browser }) => {
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
