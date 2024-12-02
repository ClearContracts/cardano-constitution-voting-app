import { alternateWallets, delegateWallets, organizerWallets } from "@constants/staticWallets";
import { pageWithInjectedWallet } from "@fixtures/importWallet";
import HomePage from "@pages/homePage";
import { StaticWallet } from "@types";
import { nAtaTime, sleep } from "./txUtil";
import PollPage from "@pages/pollPage";
import Logger from "./logger";
import { Browser, expect, Page } from "@playwright/test";
export type VotedPoll = {
  pollId: number,
  votes: Record<string,'yes'| 'no'|'abstain'>
}
export  async function createFullyVotedPoll (browser: Browser,voteCount?:number) : Promise<VotedPoll&{organizerPollPage:Page}> {
  const getPage=async (w:StaticWallet)=>await pageWithInjectedWallet(browser,w)


  const organizerPages=await Promise.all([organizerWallets[0]].map(getPage));

  const organizerHomePage = new HomePage(organizerPages[0]);
  const deleted = await organizerHomePage.deleteOpenPollCards();
  if(deleted){
      await organizerHomePage.goto()
  }
  const pollId = await organizerHomePage.createPoll()
  await organizerHomePage.beginVoteBtn.click();
  
  const voteButtons = [
    'vote-yes-button',
    'vote-no-button',
    'vote-abstain-button',
  ];
  const votes=['yes','no','abstain']
  const castedVotes={}


  await  nAtaTime(voteCount? delegateWallets.slice(0,voteCount):delegateWallets,async (wallet,index)=>{
    const context = await browser.newContext()

    let page = await pageWithInjectedWallet(context,wallet)
    
    let pollPage=new PollPage(page)
    await pollPage.goto(pollId)

    const isActive = await pollPage.voteYesBtn.waitFor({state: "visible",timeout: 30000}).then(()=>true).catch(()=>false)

    if(!isActive){
      Logger.info("User is not active voter: "+wallet.stakeAddress)
       await page.close()
       wallet=alternateWallets[index]
       page = await pageWithInjectedWallet(context,alternateWallets[index])
       pollPage=new PollPage(page)
       await pollPage.goto(pollId)
    }

    const randomVote = Math.floor(Math.random() * 3);
    await page.getByTestId(voteButtons[randomVote]).click();
    castedVotes[wallet.stakeAddress] = votes[randomVote];
    await expect(page.getByText('Vote recorded!'),"Expected Vote to be recorded for user: "+wallet.stakeAddress).toBeVisible({timeout:20000})
    await page.close()
    await context.close()
  },6);

  const organizerPollPage=new PollPage(organizerPages[0])
  await organizerPollPage.endVoting()
  await sleep(2000)
  return {pollId,votes:castedVotes,organizerPollPage:organizerPages[0]}

}