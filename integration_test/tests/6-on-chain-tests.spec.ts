import environments from "@constants/environments";
import { setAllureEpic } from "@helpers/allure";
import { createAuth } from "@helpers/auth";
import { fetchVoteTxMetadata,fetchPollSummaryMetadata, Vote, decodeOnChainPayload } from "@helpers/blockfrost";
import { newOrganizer1Page } from "@helpers/page";
import { createFullyVotedPoll, VotedPoll } from "@helpers/poll";
import { pollTransaction, sleep, waitForTxSubmit } from "@helpers/txUtil";
import PollPage from "@pages/pollPage";
import { expect, Page, test } from "@playwright/test";
import { bech32, blake, cborBackend, CoseSign1, Ed25519Key, loadCrypto } from "libcardano";


test.beforeEach(async () => {
  await setAllureEpic('6. Onchain Poll');
});


test.describe('Onchain Poll', () => {
  
  /**
   * Description: The transaction that contains the aggregated results on-chain must also contain all of the transaction IDs of the vote transactions.

      User story: As an Observer I want to have access to all the vote transaction IDs in one transaction, so that I only need to be given the reference to one transaction ID to adit the vote on-chain.

      Acceptance Criteria: Given that I am an observer, when I look up the transaction ID of the results summary transaction on-chain, then I will see all the transaction IDs of the votes for this poll.
   */ 2;
  let pollDetail: VotedPoll| undefined = undefined
  let organizerPollPage:Page|undefined = undefined
  test('6-1A . Given CO, can submit poll results onchain', async ({
    browser
  }) => {
    const voteCount=61
    const totalTxCount=Math.ceil(voteCount/9) +1 
    test.setTimeout(1500000)// set it to 25 minutes.
    const fullyVotedPoll = await createFullyVotedPoll(browser,voteCount)
    pollDetail=fullyVotedPoll;
    organizerPollPage=fullyVotedPoll.organizerPollPage;
    const page = fullyVotedPoll.organizerPollPage;
    const pollPage = new PollPage(page);
    
  

    let submitWaiter= waitForTxSubmit(page)
    // await pollPage.uploadVoteOnchainBtn.waitFor({ state: 'visible' });
    // Click the button and start transaction submission
    await pollPage.uploadVoteOnchainBtn.click({force: true,timeout: 30000});

    console.log("Upload votes button clicked!!")
    let txs:string[]=[]
    let currentTxId: string|undefined
    let i = totalTxCount;

    do{
      currentTxId=await submitWaiter
      txs.push(currentTxId)
      if(i>1){
        submitWaiter=waitForTxSubmit(page) // start submit waiter in background.
      }
      await pollTransaction(currentTxId)
    }while(--i >0)
    await page.reload({waitUntil: 'networkidle'})

    const summaryTxLink = page.locator('[data-testid="summary-tx-link"]');
    await expect(summaryTxLink).toBeVisible()
    const voteTxLink =  page.locator('[data-testid^="vote-record-tx-link-1"]');
    await expect(voteTxLink).toBeVisible()


   // check for summary link

    let newPagePopup=page.waitForEvent('popup')
    await summaryTxLink.click()
    let newPage=await newPagePopup

    await newPage.waitForLoadState('domcontentloaded');
    let expectedUrl = `/transaction/${txs[txs.length-1]}`;
    expect(newPage.url()).toContain(expectedUrl);


    // check for votes link
    newPagePopup=page.waitForEvent('popup')
    await voteTxLink.click()
    newPage=await newPagePopup

    await newPage.waitForLoadState('domcontentloaded');
    expectedUrl = `/transaction/${txs[0]}`;
    expect(newPage.url()).toContain(expectedUrl);

  });
  let onChainVotes:Vote[]=[]
  test('6-1B. Given votes are uploaded on-chain, all votes are present.', async ({
    browser,
  }) => {
    if(!pollDetail && environments.ci){
      test.skip()
      return;
    }
    const page = organizerPollPage || await newOrganizer1Page(browser)
    const pollPage=new PollPage(page);
    await pollPage.goto(pollDetail?.pollId || 2629);
    const summaryTxLink = page.locator('[data-testid="summary-tx-link"]');
    await expect(summaryTxLink).toBeVisible()
    const summaryTxHref = await summaryTxLink.getAttribute('href');
    const extractedSummaryTxHash = summaryTxHref.split('/').pop().split('?')[0];  // Get the hash part from the URL


    // Extract vote transaction hashes
    await expect(page.getByTestId('vote-record-tx-link-1')).toBeVisible()
    const voteTxLinks =  page.locator('[data-testid^="vote-record-tx-link-"]');
    const voteTxHashes = [];
    
    // Loop through each vote transaction link to extract the hashes
    for (let i = 0; i < await voteTxLinks.count(); i++) {
        const voteTxLink = voteTxLinks.nth(i);
        const voteTxHref = await voteTxLink.getAttribute('href');
        const extractedVoteTxHash = voteTxHref.split('/').pop().split('?')[0];  // Get the hash part from the URL
        voteTxHashes.push(extractedVoteTxHash);
    }

    // Validate metadata for summary transaction
    const summaryMetadata = await fetchPollSummaryMetadata(extractedSummaryTxHash);
    const voteTxSet=new Set(summaryMetadata.voteTransactions)

    expect(summaryMetadata.voteTransactions.length == voteTxHashes.length,`OnChainVote Txs=${summaryMetadata.voteTransactions.length} pageVoteTxs=${voteTxHashes.length}: Expected to be equal`).toBeTruthy(); // Ensure metadata exists

    // Validate metadata for each vote transaction
    for (let txHash of voteTxHashes) {
        expect(voteTxSet.has(txHash),"txHash: "+txHash+" present on-chain but not present on pollPage").toBeTruthy()
        const voteMetadata = await fetchVoteTxMetadata(txHash);
        onChainVotes.push(...voteMetadata)
    }

    // same no of casted and on-chain votes.
    expect(Object.keys(pollDetail.votes).length).toBe(onChainVotes.length)

    // Assert the count of on-chain and page vote shown
    const onChainYes=onChainVotes.filter(v=>v.vote == 'yes').length
    const onChainNo=onChainVotes.filter(v=>v.vote == 'no').length
    const onChainAbstain=onChainVotes.filter(v=>v.vote == 'abstain').length
    expect(await page.getByTestId('yes-count').innerHTML()).toBe(onChainYes.toString())
    expect(await page.getByTestId('no-count').innerHTML()).toBe(onChainNo.toString())
    expect(await page.getByTestId('abstain-count').innerHTML()).toBe(onChainAbstain.toString())

    // Assert that the summary data and the actual data in transactions is same.
    expect(summaryMetadata.votes.yes).toBe(onChainYes)
    expect(summaryMetadata.votes.no).toBe(onChainNo)
    expect(summaryMetadata.votes.abstain).toBe(onChainAbstain)

    const vote1=onChainVotes[0]
    expect(summaryMetadata.constutionHash).toBe(vote1.constutionHash)
    expect(summaryMetadata.pollName).toBe(vote1.pollName)
    
  });

  test('6-1C. Given votes are uploaded on-chain, vote data is correct', async () => {
    if(!onChainVotes){
      test.skip()
    }
    await loadCrypto()

    for (let vote  of onChainVotes ){
      const cosign1=CoseSign1.fromBytes(Buffer.from(vote.cosesign1,'hex'))
      const signedMessage=cosign1.payload.toString()

      const signedVote =decodeOnChainPayload(signedMessage)

      // check that the fields shown and data actually signed are same.
      expect(vote.challenge).toBe(signedVote.challenge)
      expect(vote.vote).toBe(signedVote.vote)
      expect(vote.constutionHash).toBe(signedVote.constutionHash)
      expect(vote.constutionLink).toBe(signedVote.constutionLink)
      expect(vote.voterStake).toBe(signedVote.voterStake)
      expect(vote.pollName).toBe(signedVote.pollName)

      // check that the data in metadata and the actual vote casted is same. 
      expect(vote.vote).toBe(pollDetail.votes[vote.voterStake])

      // Cryptographic verification of votes.
      const userStakeAddress=bech32.decode(vote.voterStake).data
      const userStakeKeyHash=userStakeAddress.subarray(1)
      const signerPubKey : Buffer= cborBackend.decode(Buffer.from(vote.cosekey,'hex')).get(-2)
      const signerPubKeyHash = blake.hash28(signerPubKey)
      const isSignatureValid = await cosign1.verify(await Ed25519Key.fromPublicKey(signerPubKey))
      
      expect(isSignatureValid).toBeTruthy()
      expect(Buffer.compare(signerPubKeyHash,userStakeKeyHash),"Expected siged pub key to be of voter").toBe(0)
    }
  });
});