import { faker } from '@faker-js/faker';
import { Page } from '@playwright/test';

const customHeader = { 'X-Custom-Header': 'intersect' };

export async function deletePoll(page: Page, pollId: number) {
  const res = await page.request.post('/api/archivePoll', {
    headers: customHeader,
    data: {
      pollId: pollId,
    },
  });
  return res;
}

export async function createPoll(page: Page) {
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

export async function updateUser(page: Page, userId: string = '138') {
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

export async function updateActiveVoter(
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
