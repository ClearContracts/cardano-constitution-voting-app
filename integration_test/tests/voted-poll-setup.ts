import {
  alternateWallets,
  delegateWallets,
  organizerWallets,
} from '@constants/staticWallets';
import { importWallet, injectWalletExtension, pageWithInjectedWallet } from '@fixtures/importWallet';
import loadEternlExtension from '@fixtures/loadExtension';
import { setAllureEpic, setAllureStory } from '@helpers/allure';
import Logger from '@helpers/logger';
import { nAtaTime } from '@helpers/txUtil';
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
    },10);
    const organizerPollPage=new PollPage(organizerPages[0])
    await organizerPollPage.endVoting()
});
