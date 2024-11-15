import { Page } from '@playwright/test';

export default class PollPage {
  //btn
  readonly createPollBtn = this.page.getByTestId('create-poll-button');
  readonly beginVoteBtn = this.page.getByTestId('begin-vote-button');
  readonly closeVoteBtn = this.page.getByTestId('end-vote-button');
  readonly deletePollBtn = this.page.getByTestId('DeleteRoundedIcon');
  readonly voteYesBtn = this.page.getByTestId('vote-yes-button');
  readonly voteNoBtn = this.page.getByTestId('vote-no-button');
  readonly voteAbstainBtn = this.page.getByTestId('vote-abstain-button');
  readonly endVotingBtn = this.page.getByTestId('end-vote-button')

  //chip or icon
  readonly pollPageStatusChip = this.page.getByTestId('poll-page-status-chip');
  readonly voteYesIcon = this.page.getByTestId('ThumbUpOutlinedIcon');

  constructor(private readonly page: Page) {}

  async goto(pollId: number): Promise<void> {
    this.page.goto(`/polls/${pollId}`);
  }

  async deletePoll(): Promise<void> {
    await this.deletePollBtn.click();
  }
  async  endVoting(){
    await this.endVotingBtn.click()
  }
}
