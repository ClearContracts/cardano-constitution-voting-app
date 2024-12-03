import {
  newAlternate1Page,
  newAlternate2Page,
  newDelegate1Page,
  newOrganizer1Page,
} from '@helpers/page';

import { Browser, BrowserContext, Page } from '@playwright/test';

type UserRole =
  | 'Delegate'
  | 'Alternate'
  | 'Organizer'
  | 'Anonymous'
  | 'Voter'
  | 'All';

export function getUserPages(browser, userRole?: UserRole): Promise<Page[]> {
  // setup
  let users: Promise<Page>[] = [];
  if (userRole == 'Delegate') {
    users.push(newDelegate1Page(browser));
  } else if (userRole == 'Alternate') {
    users.push(newAlternate1Page(browser));
  } else if (userRole == 'Organizer') {
    users.push(newOrganizer1Page(browser));
  } else if (userRole == 'All' || userRole == undefined) {
    users = [
      newOrganizer1Page(browser),
      newAlternate1Page(browser),
      newDelegate1Page(browser),
      browser.newPage(),
    ];
  }
  return Promise.all(users);
}

export function forEachUser(
  handler: (user: {
    role: string;
    loader: (browser:  Browser|BrowserContext) => Promise<Page>;
  }) => unknown
) {
  const users: {
    role: string;
    handler: (browser: Browser|BrowserContext) => Promise<Page>;
  }[] = [
    {
      role: 'Alternate',
      handler: (browser) => newAlternate2Page(browser),
    },
    {
      role: 'Delegate',
      handler: (browser) => newAlternate2Page(browser),
    },
    {
      role: 'Organizer',
      handler: (browser) => newAlternate2Page(browser),
    },
    {
      role: 'Anonymous',
      handler: (browser) => browser.newPage(),
    },
  ];
  users.forEach((u) => {
    handler({
      role: u.role,
      loader: (browser) => {
        return u.handler(browser);
      },
    });
  });
}
