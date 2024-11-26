import { getRepresentatativesErrorHandlers } from '@/../__mocks__/getRepresentatives/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { RepresentativesTable } from '@/components/representatives/representativesTable';

test('shows no representatives found message', async () => {
  server.use(...getRepresentatativesErrorHandlers);
  render(
    <RepresentativesTable
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
    />,
  );
  expect(await screen.findByText('No Representatives found.')).toBeDefined();
});
