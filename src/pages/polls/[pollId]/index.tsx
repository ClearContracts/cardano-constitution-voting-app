/* eslint-disable indent */
import { useCallback, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { pollPhases } from '@/constants/pollPhases';
import { DeleteRounded } from '@mui/icons-material';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import { Button, CircularProgress, Modal, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import type { Poll, User, Workshop } from '@/types';
import { pollDto } from '@/data/pollDto';
import { pollResultsDto } from '@/data/pollResultsDto';
import { pollsDto } from '@/data/pollsDto';
import { representativesDto } from '@/data/representativesDto';
import { workshopsDto } from '@/data/workshopsDto';
import { getPoll } from '@/lib/helpers/getPoll';
import { getPollResults } from '@/lib/helpers/getPollResults';
import { useCheckAddressChange } from '@/hooks/useCheckAddressChange';
import { BeginVoteButton } from '@/components/buttons/beginVoteButton';
import { DeletePollButton } from '@/components/buttons/deletePollButton';
import { EndVoteButton } from '@/components/buttons/endVoteButton';
import { PutVotesOnChainButton } from '@/components/buttons/putVotesOnChainButton';
import { VoteOnPollButtons } from '@/components/buttons/voteOnPollButtons';
import { CoordinatorViewVotes } from '@/components/polls/coordinatorViewVotes';
import { PollCarrousel } from '@/components/polls/pollCarrousel';
import { PollResults } from '@/components/polls/pollResults';
import { PollStatusChip } from '@/components/polls/pollStatusChip';
import { PollVoteCount } from '@/components/polls/pollVoteCount';
import { MobileRepresentativesTable } from '@/components/representatives/mobileRepresentativesTable';
import { RepresentativesTable } from '@/components/representatives/representativesTable';
import { TxPopup } from '@/components/txPopups/txPopup';

interface Props {
  poll: Poll | null;
  representatives: User[];
  workshops: Workshop[];
  pollResultsSSR: {
    yes: {
      name: string;
      id: string;
    }[];
    no: {
      name: string;
      id: string;
    }[];
    abstain: {
      name: string;
      id: string;
    }[];
  };
  polls: Poll[];
}

export default function ViewPoll(props: Props): JSX.Element {
  const { representatives, workshops, pollResultsSSR, polls } = props;
  let { poll } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pollResults, setPollResults] = useState(pollResultsSSR);
  const [isTxUploading, setIsTxUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useCheckAddressChange();
  const session = useSession();
  const theme = useTheme();
  const router = useRouter();

  const { pollId } = router.query;

  // Using react-query to fetch and refresh the vote count
  const { isPending, error, data } = useQuery({
    queryKey: ['poll', pollId],
    queryFn: async () => {
      if (typeof pollId === 'string') {
        const data = await getPoll(pollId);
        const pollResults = await getPollResults(pollId);
        if (pollResults.votes) {
          setPollResults(pollResults.votes);
        }
        return data;
      }
    },
    enabled: typeof pollId === 'string' && pollId !== '',
    refetchInterval: 5000, // refresh every 5 seconds
  });

  const updateIsSubmitting = useCallback((value: boolean) => {
    setIsSubmitting(value);
  }, []);

  const updateIsTxUploading = useCallback((value: boolean) => {
    setIsTxUploading(value);
  }, []);

  const updatePollResults = useCallback(
    (newPollResults: {
      yes: {
        name: string;
        id: string;
      }[];
      no: {
        name: string;
        id: string;
      }[];
      abstain: {
        name: string;
        id: string;
      }[];
    }) => {
      setPollResults(newPollResults);
    },
    [],
  );

  if (data && data.poll) {
    poll = data.poll;
  }

  if (error) {
    toast.error(data?.message || error?.message || 'Error fetching poll');
  }

  function handleModalClose(): void {
    setModalOpen(false);
  }

  function openAreYouSure(): void {
    setModalOpen(true);
  }

  function handleOpenDeleteModal(): void {
    setDeleteModalOpen(true);
  }

  function handleCloseDeleteModal(): void {
    setDeleteModalOpen(false);
  }

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
        <Box display="flex" flexDirection="column" gap={3}>
          {poll?.is_archived && (
            <Typography variant="h1" fontWeight="bold" color="error">
              Archived
            </Typography>
          )}
          <Typography variant="h4" fontWeight="bold">
            {poll ? poll.name : isPending ? <CircularProgress /> : 'View Poll'}
          </Typography>
          {poll && <PollStatusChip status={poll.status} />}
          <PollVoteCount pollId={poll?.id || ''} />
          <Grid container data-testid="poll-transactions">
            {poll ? (
              <Grid
                size={{ xs: 12, lg: 6 }}
                sx={{
                  pr: {
                    xs: 0,
                    lg: 12,
                  },
                }}
                display="flex"
                flexDirection="column"
                gap={3}
              >
                <Box>
                  <Button
                    variant="outlined"
                    href={poll.link}
                    target="_blank"
                    startIcon={<LaunchRounded />}
                  >
                    <Typography>View Constitution Text</Typography>
                  </Button>
                </Box>

                <Typography
                  sx={{
                    wordWrap: 'break-word', // Break long words
                    overflowWrap: 'break-word', // Ensures wrapping works on all browsers
                    whiteSpace: 'normal', // Allows text to wrap
                  }}
                >
                  The linked text document has the Blake2b-256 hash of:{' '}
                  {poll.hashedText}
                </Typography>
                {isSubmitting && !isTxUploading && (
                  <Box marginTop={3} marginBottom={3}>
                    <TxPopup
                      title="Constructing Next Transaction"
                      message="Preparing next TX for signing"
                    />
                  </Box>
                )}
                {isTxUploading && (
                  <Box marginTop={3} marginBottom={3}>
                    <TxPopup
                      title="Transaction Submitting"
                      message="The next TX will be prepared once this one is confirmed."
                    />
                  </Box>
                )}
              </Grid>
            ) : (
              !isPending && <Typography variant="h4">Poll not found</Typography>
            )}
            {poll && (
              <Grid size={{ xs: 12, lg: 6 }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={3}
                  alignItems="center"
                >
                  {/* Coordinator Buttons */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    alignItems="center"
                  >
                    {session.data?.user.isCoordinator && (
                      <>
                        <Typography>Manage Poll:</Typography>
                        <Box
                          display="flex"
                          flexDirection="row"
                          gap={1}
                          alignItems="center"
                        >
                          {poll.status === pollPhases.pending && (
                            <BeginVoteButton pollId={pollId} />
                          )}
                          {poll.status === pollPhases.voting && (
                            <Button
                              variant="contained"
                              onClick={openAreYouSure}
                            >
                              End Vote
                            </Button>
                          )}
                          {poll.status === pollPhases.concluded &&
                            !poll.summary_tx_id && (
                              <PutVotesOnChainButton
                                pollId={pollId}
                                isSubmitting={isSubmitting}
                                setIsSubmitting={updateIsSubmitting}
                                setIsTxUploading={updateIsTxUploading}
                              />
                            )}
                          <Button color="error" onClick={handleOpenDeleteModal}>
                            <DeleteRounded />
                          </Button>
                        </Box>
                      </>
                    )}
                    {session.data?.user.isCoordinator &&
                      poll.status === pollPhases.voting && (
                        <Box display="flex">
                          <CoordinatorViewVotes
                            votes={pollResults}
                            workshops={workshops}
                            representatives={representatives}
                          />
                        </Box>
                      )}
                  </Box>
                  {/* Delegate Voting Buttons */}
                  {poll.status === pollPhases.voting && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={1}
                      alignItems="center"
                    >
                      <VoteOnPollButtons
                        pollName={poll.name}
                        pollId={poll.id}
                        hashedText={poll.hashedText}
                        link={poll.link}
                      />
                    </Box>
                  )}
                  {/* Vote Results */}
                  {poll.status === pollPhases.concluded &&
                    typeof pollId === 'string' && (
                      <PollResults
                        votes={pollResults}
                        pollId={pollId}
                        summaryTxId={poll.summary_tx_id || ''}
                      />
                    )}
                </Box>
              </Grid>
            )}
          </Grid>
          <Box display="flex" flexDirection="column" gap={3} mt={10}>
            {/* Browse Other Polls Carrousel */}
            <PollCarrousel
              currentPollId={pollId}
              polls={polls}
              isPollPage={true}
            />
            <Box
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex',
                },
                width: '100%',
              }}
            >
              <RepresentativesTable
                representatives={representatives}
                workshops={workshops}
              />
            </Box>
            <Box
              sx={{
                display: {
                  xs: 'flex',
                  md: 'none',
                },
                width: '100%',
              }}
            >
              <MobileRepresentativesTable
                representatives={representatives}
                workshops={workshops}
              />
            </Box>
          </Box>
        </Box>
        <Modal open={modalOpen} onClose={handleModalClose}>
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            alignItems="center"
            sx={{
              position: 'absolute',
              top: '20vh',
              left: { xs: '10%', lg: '50%' },
              transform: {
                xs: 'translate(0%, -25%)',
                sm: 'translate(0%, 0%)',
                lg: 'translate(-50%, 0%)',
              },
              width: { xs: '80%', lg: '30%' },
              maxHeight: { xs: '40%', sm: '20vh' },
              overflowY: 'auto',
              border: 'none',
              boxShadow: 24,
              bgcolor: theme.palette.background.paper,
              borderRadius: `${theme.shape.borderRadius}px`,
              color: theme.palette.text.primary,
              p: { xs: 2, md: 4 },
              zIndex: 500,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Are you sure you want to end voting?
            </Typography>
            <Box display="flex" flexDirection="row" gap={4}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <EndVoteButton
                pollId={pollId}
                updatePollResults={updatePollResults}
                onClick={handleModalClose}
              />
            </Box>
          </Box>
        </Modal>
        <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            alignItems="center"
            sx={{
              position: 'absolute',
              top: '20vh',
              left: { xs: '10%', lg: '50%' },
              transform: {
                xs: 'translate(0%, -25%)',
                sm: 'translate(0%, 0%)',
                lg: 'translate(-50%, 0%)',
              },
              width: { xs: '80%', lg: '30%' },
              maxHeight: { xs: '40%', sm: '20vh' },
              overflowY: 'auto',
              border: 'none',
              boxShadow: 24,
              bgcolor: theme.palette.background.paper,
              borderRadius: `${theme.shape.borderRadius}px`,
              color: theme.palette.text.primary,
              p: { xs: 2, md: 4 },
              zIndex: 500,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Are you sure you want to delete this Poll?
            </Typography>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={{ xs: 1, sm: 4 }}
            >
              <Button variant="outlined" onClick={handleCloseDeleteModal}>
                Cancel
              </Button>
              <DeletePollButton pollId={pollId} />
            </Box>
          </Box>
        </Modal>
      </main>
    </>
  );
}

type Params = {
  pollId: string;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<Params>,
): Promise<{
  props: {
    poll: Poll | null;
    representatives: User[];
    workshops: Workshop[];
    pollResultsSSR: {
      [key: string]: {
        name: string;
        id: string;
      }[];
    };
    polls: Poll[];
  };
}> => {
  if (!context.params) {
    return {
      props: {
        poll: null,
        representatives: [],
        workshops: [],
        pollResultsSSR: {},
        polls: [],
      },
    };
  }

  const { pollId } = context.params;

  const poll = await pollDto(pollId);
  const representatives = await representativesDto();
  const workshops = await workshopsDto();
  const pollResultsSSR = await pollResultsDto(pollId);
  const polls = await pollsDto();

  return {
    props: {
      poll: poll,
      representatives: representatives,
      workshops: workshops,
      pollResultsSSR: pollResultsSSR,
      polls: polls,
    },
  };
};
