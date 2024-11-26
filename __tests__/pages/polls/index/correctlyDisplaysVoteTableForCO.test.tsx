import ViewPoll from '@/pages/polls/[pollId]';
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { expect, test } from 'vitest';

test('correctly displays vote table for CO', async () => {
  render(
    <SessionProvider
      session={{
        expires: '1',
        user: {
          id: '1',
          stakeAddress: 'stakeAddress',
          walletName: 'walletName',
          isCoordinator: false,
          isDelegate: true,
          isAlternate: false,
        },
      }}
    >
      <ViewPoll
        poll={{
          id: '1',
          name: 'Poll #1',
          hashedText:
            '1dda86a28da3715e618a1605f81c7a3121ce767cdc9bd0d46beec0bef40e8125',
          link: 'https://2024constitutionalconsultation.docs.intersectmbo.org/cardanos-constitution/draft-cardano-constitution',
          status: 'pending',
          summary_tx_id: null,
          is_archived: false,
        }}
        representatives={[
          {
            id: '1',
            is_convention_organizer: true,
            is_delegate: false,
            is_alternate: false,
            workshop_id: '1',
            name: 'Test CO',
            email: 'email@email.com',
            wallet_address: 'coStakeAddress',
          },
          {
            id: '7',
            is_convention_organizer: false,
            is_delegate: true,
            is_alternate: false,
            workshop_id: '2',
            name: 'Test Delegate',
            email: 'delagate@email.com',
            wallet_address: 'delegateStakeAddress',
          },
          {
            id: '8',
            is_convention_organizer: false,
            is_delegate: false,
            is_alternate: true,
            workshop_id: '2',
            name: 'Test Alternate',
            email: 'alternate@email.com',
            wallet_address: 'alternateStakeAddress',
          },
        ]}
        workshops={[
          {
            id: '1',
            name: 'Convention Organizer',
            delegate_id: null,
            alternate_id: null,
            active_voter_id: null,
          },
          {
            id: '2',
            name: 'Argentina, Buenos Aires 1',
            delegate_id: '7',
            alternate_id: '8',
            active_voter_id: '7',
          },
        ]}
        pollResultsSSR={{
          yes: [],
          no: [],
          abstain: [],
        }}
        polls={[
          {
            id: '1',
            name: 'Poll #1',
            hashedText:
              '1dda86a28da3715e618a1605f81c7a3121ce767cdc9bd0d46beec0bef40e8125',
            link: 'https://2024constitutionalconsultation.docs.intersectmbo.org/cardanos-constitution/draft-cardano-constitution',
            status: 'pending',
            summary_tx_id: null,
            is_archived: false,
          },
        ]}
        workshopActiveVoterId=""
      />
    </SessionProvider>,
  );

  const workshop = screen.getByText('Argentina, Buenos Aires 1');
  expect(workshop).toBeDefined();
  const delegate = screen.getByText('Test Delegate');
  expect(delegate).toBeDefined();
  const alternate = screen.getByText('Test Alternate');
  expect(alternate).toBeDefined();
  const yesVote = await screen.findByText('Yes');
  expect(yesVote).toBeDefined();
  const noVote = await screen.findByText('No');
  expect(noVote).toBeDefined();
  const abstainVote = await screen.findByText('Abstain');
  expect(abstainVote).toBeDefined();
});
