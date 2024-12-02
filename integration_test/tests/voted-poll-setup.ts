import {
  alternateWallets,
  delegateWallets,
  organizerWallets,
} from '@constants/staticWallets';
import { importWallet, injectWalletExtension } from '@fixtures/importWallet';
import loadEternlExtension from '@fixtures/loadExtension';
import { setAllureEpic, setAllureStory } from '@helpers/allure';
import Logger from '@helpers/logger';
import HomePage from '@pages/homePage';
import LoginPage from '@pages/loginPage';
import PollPage from '@pages/pollPage';
import test, { Browser, expect, Page } from '@playwright/test';
import { StaticWallet } from '@types';



test.beforeEach(async () => {
  await setAllureEpic('Setup');
  await setAllureStory('Poll');
});

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pageWithInjectedWallet(browser:Browser, wallet:StaticWallet): Promise<Page> {
  const page = await browser.newPage();
  await loadEternlExtension(page);

  await injectWalletExtension(page, wallet);

  const loginPage = new LoginPage(page);
  await loginPage.login();
  return page;
}
test(`Create Voted Poll`, async ({browser }) => {
    test.setTimeout(300000) // let's set it to 5 minute
    const getPage=async (w:StaticWallet)=>await pageWithInjectedWallet(browser,w)


    const organizerPages=await Promise.all([organizerWallets[0]].map(getPage));

    const organizerHomePage = new HomePage(organizerPages[0]);
    const deleted = await organizerHomePage.deleteOpenPollCards();
    if(deleted){
        await organizerHomePage.goto()
    }
    const pollId = await organizerHomePage.createPoll()
    await organizerHomePage.beginVoteBtn.click();
    
    const votes = [
      'vote-yes-button',
      'vote-no-button',
      'vote-abstain-button',
    ];

    await  nAtaTime(delegateWallets,async (wallet,index)=>{
      let page = await pageWithInjectedWallet(browser,wallet)
      let pollPage=new PollPage(page)
      await pollPage.goto(pollId)

      const isActive = await pollPage.voteYesBtn.waitFor({state: "visible",timeout: 30000}).then(()=>true).catch(()=>false)

      if(!isActive){
        Logger.info("User is not active voter: "+wallet.stakeAddress)
         await page.close()
         wallet=alternateWallets[index]
         page = await pageWithInjectedWallet(browser,alternateWallets[index])
         pollPage=new PollPage(page)
         await pollPage.goto(pollId)
      }

      const randomVote = Math.floor(Math.random() * 3);
      await page.getByTestId(votes[randomVote]).click();
      await expect(page.getByText('Vote recorded!'),"Expected Vote to be recorded for user: "+wallet.stakeAddress).toBeVisible({timeout:10000})
      await page.close()
    });
    const organizerPollPage=new PollPage(organizerPages[0])
    await organizerPollPage.endVoting()
});

async function nAtaTime<T,U>(array: T[], f: (item: T,index?:number) => Promise<U>,n:number =10): Promise<U[]> {
    const chunkSize = n;
    let results: U[] = [];
  
    // Process the array in chunks of `n`
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
  
      // Wait for all async operations on this chunk to finish and collect the results
      const chunkResults = await Promise.all(chunk.map((item,index) => f(item,index)));
      
      // Push the results of the current chunk to the results array
      results.push(...chunkResults);
    }
  
    return results;
  }
  