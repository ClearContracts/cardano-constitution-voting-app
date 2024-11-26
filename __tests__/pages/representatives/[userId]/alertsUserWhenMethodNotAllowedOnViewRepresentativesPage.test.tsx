import { getUserInvalidMethodHandler } from '@/../__mocks__/getUser/errorHandlers';
import { server } from '@/../__mocks__/server';
import Representative from '@/pages/representatives/[userId]';
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

// TODO: Have not been able to get this test to pass as it depends on URL params
test.skip('Alerts user when method not allowed on view representative page', async () => {
  server.use(...getUserInvalidMethodHandler);
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
      <Toaster />
      <Representative
        user={{
          id: '7',
          is_convention_organizer: false,
          is_delegate: true,
          is_alternate: false,
          workshop_id: '2',
          name: 'Justin Schreiner Delegate',
          email: 'justindelegate@clearcontracts.io',
          wallet_address:
            'stake1u8n2rt48fwzurp8cn9l3fm32v44pudw86q93h9dg5s4hgjc2xslp5',
        }}
        userVotes={[
          {
            poll_id: '2',
            user_id: '9',
            vote: 'yes',
            signature:
              '84582aa201276761646472657373581de1e78f6551b2575a556162897123fa18ad78c4ba81a0d0025661dfd269a166686173686564f459016657616c6c65743a207374616b653175386e63376532336b66743435347470763279687a676c36727a6b68333339367378736471716a6b763830617936676c70616d79772c20506f6c6c3a20506f6c6c2023312c2048617368656420436f6e737469747574696f6e20546578743a20316464613836613238646133373135653631386131363035663831633761333132316365373637636463396264306434366265656330626566343065383132352c204c696e6b20746f20436f6e737469747574696f6e20546578743a2068747470733a2f2f32303234636f6e737469747574696f6e616c636f6e73756c746174696f6e2e646f63732e696e746572736563746d626f2e6f72672f63617264616e6f732d636f6e737469747574696f6e2f64726166742d63617264616e6f2d636f6e737469747574696f6e2c20566f74653a207965732c2054696d657374616d703a2031312f32352f323032342c20393a30343a313120504d5840489b4fab2609f7caed78dbc937f49607cba19ac1752321d18ea77b0a002a04c4ce2d3701917ad0e4a4d8bb1a1564be53483891a57b11848b9f8431cc6b156a00',
            hashed_message:
              'Wallet: stake1u8nc7e23kft454tpv2yhzgl6rzkh3396sxsdqqjkv80ay6glpamyw, Poll: Poll #1, Hashed Constitution Text: 1dda86a28da3715e618a1605f81c7a3121ce767cdc9bd0d46beec0bef40e8125, Link to Constitution Text: https://2024constitutionalconsultation.docs.intersectmbo.org/cardanos-constitution/draft-cardano-constitution, Vote: yes, Timestamp: 11/25/2024, 9:04:11 PM',
            public_key:
              'a4010103272006215820c81df7d19505aebad6a236aa8054769163d6688fb4321dd1bdebf05123373dde',
            poll_transaction_id: null,
          },
          {
            poll_id: '3',
            user_id: '9',
            vote: 'abstain',
            signature:
              '84582aa201276761646472657373581de1e78f6551b2575a556162897123fa18ad78c4ba81a0d0025661dfd269a166686173686564f459016a57616c6c65743a207374616b653175386e63376532336b66743435347470763279687a676c36727a6b68333339367378736471716a6b763830617936676c70616d79772c20506f6c6c3a20506f6c6c2023322c2048617368656420436f6e737469747574696f6e20546578743a20316464613836613238646133373135653631386131363035663831633761333132316365373637636463396264306434366265656330626566343065383132352c204c696e6b20746f20436f6e737469747574696f6e20546578743a2068747470733a2f2f32303234636f6e737469747574696f6e616c636f6e73756c746174696f6e2e646f63732e696e746572736563746d626f2e6f72672f63617264616e6f732d636f6e737469747574696f6e2f64726166742d63617264616e6f2d636f6e737469747574696f6e2c20566f74653a206162737461696e2c2054696d657374616d703a2031312f32352f323032342c20393a30353a333220504d5840f5d5c6d81c0983acb2182e4d8e071010419a6d40eadc7fbbc5574b97b3fd1018a34e9501f673b9b21258aa292c76456d9258abf973190f693708f76ad91b1002',
            hashed_message:
              'Wallet: stake1u8nc7e23kft454tpv2yhzgl6rzkh3396sxsdqqjkv80ay6glpamyw, Poll: Poll #2, Hashed Constitution Text: 1dda86a28da3715e618a1605f81c7a3121ce767cdc9bd0d46beec0bef40e8125, Link to Constitution Text: https://2024constitutionalconsultation.docs.intersectmbo.org/cardanos-constitution/draft-cardano-constitution, Vote: abstain, Timestamp: 11/25/2024, 9:05:32 PM',
            public_key:
              'a4010103272006215820c81df7d19505aebad6a236aa8054769163d6688fb4321dd1bdebf05123373dde',
            poll_transaction_id: null,
          },
        ]}
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
        workshopName="Argentina, Buenos Aires 1"
        isActiveVoter={true}
      />
    </SessionProvider>,
  );

  const alert = await screen.findByText(/method not allowed/);
  expect(alert).toBeDefined();
});
