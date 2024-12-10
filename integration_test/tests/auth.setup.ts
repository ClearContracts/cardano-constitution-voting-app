import {
  alternateWallets,
  delegateWallets,
  organizerWallets,
} from '@constants/staticWallets';
import { test as setup } from '@fixtures/walletExtension';
import { setAllureStory } from '@helpers/allure';
import { createAuth } from '@helpers/auth';
import { allure } from 'allure-playwright';

const authConfigurations = [
  {
    wallet: organizerWallets[0],
    authFile: '.auth/organizer1.json',
    name: 'Organizer1',
  },
  {
    wallet: delegateWallets[0],
    authFile: '.auth/delegate1.json',
    name: 'Delegate1',
  },
  {
    wallet: alternateWallets[0],
    authFile: '.auth/alternate1.json',
    name: 'Alternate1',
  },
  {
    wallet: delegateWallets[1],
    authFile: '.auth/delegate2.json',
    name: 'Delegate2',
  },
  {
    wallet: alternateWallets[1],
    authFile: '.auth/alternate2.json',
    name: 'Alternate2',
  },
  {
    wallet: delegateWallets[2],
    authFile: '.auth/delegate3.json',
    name: 'Delegate3',
  },
  {
    wallet: alternateWallets[2],
    authFile: '.auth/alternate3.json',
    name: 'Alternate3',
  },
  {
    wallet: delegateWallets[3],
    authFile: '.auth/delegate4.json',
    name: 'Delegate4',
  },
  {
    wallet: alternateWallets[3],
    authFile: '.auth/alternate4.json',
    name: 'Alternate4',
  },
  {
    wallet: delegateWallets[4],
    authFile: '.auth/delegate5.json',
    name: 'Delegate5',
  },
  {
    wallet: alternateWallets[4],
    authFile: '.auth/alternate5.json',
    name: 'Alternate5',
  },
];

setup.beforeEach(async () => {
  await allure.epic('Setup');
  await setAllureStory('Authentication');
});

authConfigurations.forEach(({ wallet, authFile, name }) => {
  setup(`Create ${name} auth`, async ({ page, context }) => {
    await createAuth({
      page,
      context,
      wallet,
      auth: authFile,
    });
  });
});
