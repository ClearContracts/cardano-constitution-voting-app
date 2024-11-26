import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Carousel from 'react-material-ui-carousel';

import type { Poll } from '@/types';
import { PollCard } from '@/components/polls/pollCard';

interface Props {
  currentPollId: string | string[] | undefined;
  polls: Poll[];
}

/**
 * A Carrousel of poll cards
 * @param currentPollId - The ID of the current poll
 * @param polls - The list of polls
 * @returns Poll List
 */
export function PollCarrousel(props: Props): JSX.Element {
  const { currentPollId, polls } = props;

  let pollsToDisplay = useMemo(() => [...polls], [polls]);

  // Do not show current poll
  if (typeof currentPollId === 'string') {
    pollsToDisplay = polls.filter((poll) => poll.id !== currentPollId);
  }

  // only show the last 4 polls in this view
  pollsToDisplay.reverse();
  pollsToDisplay.splice(4);

  const pollCards = useMemo(() => {
    return (
      <>
        {/* Small Screen, carousel on top of the page */}
        <Box
          display={{
            xs: 'flex',
            md: 'none',
          }}
          flexDirection="column"
          width="100%"
          data-testid="poll-carousel"
        >
          <Carousel autoPlay={false}>
            {pollsToDisplay.map((poll) => {
              return (
                <Box key={poll.id}>
                  <PollCard poll={poll} />
                </Box>
              );
            })}
          </Carousel>
        </Box>
        {/* Large Screen, show all cards in a grid */}
        <Box
          display={{
            xs: 'none',
            md: 'flex',
          }}
          flexDirection="column"
          width="100%"
          justifyContent="center"
        >
          <Grid
            container
            spacing={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {pollsToDisplay.map((poll) => {
              return (
                <Grid
                  size={{
                    xs: 6,
                    xl: 3,
                  }}
                  key={poll.id}
                >
                  <PollCard poll={poll} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </>
    );
  }, [pollsToDisplay]);

  if (pollsToDisplay.length > 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        width="100%"
        alignItems="center"
      >
        <Typography textAlign="center" variant="h6" fontWeight="600">
          Browse other polls
        </Typography>
        {pollCards}
      </Box>
    );
  } else {
    return <></>;
  }
}
