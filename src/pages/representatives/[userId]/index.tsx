import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { HowToVoteRounded } from '@mui/icons-material';
import {
  Box,
  Chip,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import type { Poll, PollVote, User, Workshop } from '@/types';
import { pollsDto } from '@/data/pollsDto';
import { representativesDto } from '@/data/representativesDto';
import { userDto } from '@/data/userDto';
import { userVotesDto } from '@/data/userVotesDto';
import { workshopNameDto } from '@/data/workshopNameDto';
import { workshopsDto } from '@/data/workshopsDto';
import { useCheckAddressChange } from '@/hooks/useCheckAddressChange';
import { PollCarrousel } from '@/components/polls/pollCarrousel';
import { RepresentativesTable } from '@/components/representatives/representativesTable';
import { VotingHistoryTable } from '@/components/representatives/votingHistoryTable';

interface Props {
  user: User;
  userVotes: PollVote[];
  representatives: User[];
  workshops: Workshop[];
  workshopName: string | null;
  polls: Poll[];
  isActiveVoter: boolean;
}

export default function Representative(props: Props): JSX.Element {
  const {
    user,
    userVotes,
    representatives,
    workshops,
    workshopName,
    polls,
    isActiveVoter,
  } = props;

  useCheckAddressChange();
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Constitutional Convention Voting App</title>
        <meta
          name="description"
          content="Voting app to be used by delegates at the Cardano Constitutional Convention in Buenos Aires to ratify the initial constitution. This voting app was commissioned by Intersect."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="img/png" href="/cardano.png" />
      </Head>
      <main>
        <Box display="flex" flexDirection="column" gap={9}>
          <Grid container>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              {user ? (
                <Box display="flex" flexDirection="column" gap={3}>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    data-testid="user-name"
                  >
                    {user.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    data-testid="user-wallet-address"
                    sx={{
                      wordWrap: 'break-word', // Break long words
                      overflowWrap: 'break-word', // Ensures wrapping works on all browsers
                      whiteSpace: 'normal', // Allows text to wrap
                    }}
                  >
                    {user.wallet_address}
                  </Typography>
                  <Box display="flex" flexDirection="row" gap={1}>
                    <Box sx={{ color: theme.palette.text.disabled }}>
                      {isActiveVoter === true ? (
                        <Chip
                          variant="outlined"
                          color="success"
                          label="Active Voter"
                        ></Chip>
                      ) : (
                        <Chip
                          variant="outlined"
                          label="Not an active voter"
                        ></Chip>
                      )}
                    </Box>
                    {user.is_delegate && (
                      <Box>
                        <Chip
                          variant="outlined"
                          color="primary"
                          label="Delegate"
                        ></Chip>
                      </Box>
                    )}
                    {user.is_alternate && (
                      <Box sx={{ color: theme.palette.text.disabled }}>
                        <Chip variant="outlined" label="Alternate"></Chip>
                      </Box>
                    )}
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap={1}
                    alignItems="center"
                    color={theme.palette.text.primary}
                  >
                    <HowToVoteRounded />
                    <Typography data-testid="user-vote-count">
                      {userVotes.length} vote
                      {userVotes.length === 1 ? '' : 's'} cast
                    </Typography>
                  </Box>
                  <Typography variant="h6" data-testid="workshop-name">
                    {workshopName || 'Failed to retrieve workshop'}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
              sx={{
                mt: {
                  xs: 6,
                  md: 0,
                },
              }}
            >
              <VotingHistoryTable
                userId={user.id}
                votes={userVotes}
                polls={polls}
              />
            </Grid>
          </Grid>

          <PollCarrousel currentPollId={undefined} polls={polls} />
          <RepresentativesTable
            representatives={representatives}
            workshops={workshops}
          />
        </Box>
      </main>
    </>
  );
}

type Params = {
  userId: string;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<Params>,
): Promise<{
  props: {
    user: User | null;
    userVotes: PollVote[];
    representatives: User[];
    workshops: Workshop[];
    workshopName: string | null;
    polls: Poll[];
    isActiveVoter: boolean;
  };
}> => {
  if (!context.params) {
    return {
      props: {
        user: null,
        userVotes: [],
        representatives: [],
        workshops: [],
        workshopName: '',
        polls: [],
        isActiveVoter: false,
      },
    };
  }

  const user = await userDto(context.params.userId);

  if (!user) {
    return {
      props: {
        user: null,
        userVotes: [],
        representatives: [],
        workshops: [],
        workshopName: '',
        polls: [],
        isActiveVoter: false,
      },
    };
  }

  const userVotes = await userVotesDto(context.params.userId);
  const representatives = await representativesDto();
  const workshops = await workshopsDto();
  const workshopName = await workshopNameDto(user.workshop_id);
  const polls = await pollsDto();

  const userWorkshop = workshops.find(
    (workshop) => workshop.id === user.workshop_id,
  );

  const workshopActiveVoterId = userWorkshop?.active_voter_id;

  const isUserActiveVoter = user.id === workshopActiveVoterId;

  return {
    props: {
      user: user,
      userVotes: userVotes,
      representatives: representatives,
      workshops: workshops,
      workshopName: workshopName,
      polls: polls,
      isActiveVoter: isUserActiveVoter,
    },
  };
};
