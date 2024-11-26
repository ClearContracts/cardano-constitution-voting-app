import Head from 'next/head';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';

import type { Poll, User, Workshop } from '@/types';
import { paths } from '@/paths';
import { pollsDto } from '@/data/pollsDto';
import { representativesDto } from '@/data/representativesDto';
import { workshopsDto } from '@/data/workshopsDto';
import { useCheckAddressChange } from '@/hooks/useCheckAddressChange';
import { ConnectWalletButton } from '@/components/buttons/connectWalletButton';
import { PollList } from '@/components/polls/pollList';
import { RepresentativesTable } from '@/components/representatives/representativesTable';

interface Props {
  polls: Poll[];
  representatives: User[];
  workshops: Workshop[];
}

export default function Home(props: Props): JSX.Element {
  const { polls, representatives, workshops } = props;
  const session = useSession();
  useCheckAddressChange();

  return (
    <>
      <Head>
        <title>Constitutional Convention Voting App</title>
        <meta
          name="description"
          content="Voting app to be used by delegates at the Cardano Constitutional Convention in Buenos Aires to ratify the initial constitution. This voting app was commissioned by Intersect."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🗳️</text></svg>"
        />
      </Head>
      <main>
        <Box display="flex" flexDirection="column" gap={4} alignItems="center">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
          >
            {session.data?.user.isCoordinator && (
              <Box display="flex" flexDirection="row" gap={4}>
                <Link href={paths.polls.new} data-testid="create-poll-button">
                  <Button variant="contained">Create Poll</Button>
                </Link>
                <Link
                  href={paths.representatives.manage}
                  data-testid="create-poll-button"
                >
                  <Button variant="contained" color="secondary">
                    Manage Users
                  </Button>
                </Link>
              </Box>
            )}
            <Typography variant="h3" fontWeight="bold" textAlign="center">
              Welcome to the Constitutional Convention Voting Tool
            </Typography>
            <Box
              display={session.status == 'authenticated' ? 'none' : 'flex'}
              flexDirection="column"
              gap={1}
              alignItems="center"
            >
              <Typography variant="h5" fontWeight="500" textAlign="center">
                Are you a delegate?
              </Typography>
              <Typography variant="h6" textAlign="center">
                Connect a wallet to cast your vote:
              </Typography>
              <ConnectWalletButton isHomepage={true} />
            </Box>
          </Box>
          <PollList polls={polls} />
          <RepresentativesTable
            representatives={representatives}
            workshops={workshops}
          />
        </Box>
      </main>
    </>
  );
}

export const getServerSideProps = async (): Promise<{
  props: {
    polls: Poll[];
    representatives: User[];
    workshops: Workshop[];
  };
}> => {
  const polls = await pollsDto();
  const representatives = await representativesDto();
  const workshops = await workshopsDto();

  return {
    props: {
      polls: polls,
      representatives: representatives,
      workshops: workshops,
    },
  };
};
