import Head from 'next/head';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';

import { paths } from '@/paths';
import { ConnectWalletButton } from '@/components/buttons/connectWalletButton';
import { PollList } from '@/components/polls/pollList';
import { RepresentativesTable } from '@/components/representatives/representativesTable';

export default function Home(): JSX.Element {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Constitutional Convention Voting App</title>
        <meta
          name="description"
          content="Voting app to be used by delegates at the Cardano Constitutional Convention in Buenos Aires to ratify the initial constitution. This voting app was commissioned by Intersect."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
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
        <Box display="flex" flexDirection="column" gap={4} alignItems="center">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
          >
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
              <ConnectWalletButton />
            </Box>
          </Box>
          <PollList />
          <RepresentativesTable />
        </Box>
      </main>
    </>
  );
}
