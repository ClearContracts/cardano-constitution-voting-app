import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import type { Poll } from '@/types';
import { getPolls } from '@/lib/helpers/getPolls';
import { PollCard } from '@/components/polls/pollCard';

interface Props {
  polls: Poll[];
}

/**
 * A grid of all polls with their status and a link to view the poll, to be shown on the homepage
 * @param polls - List of Polls from SSR
 * @returns Poll List
 */
export function PollList(props: Props): JSX.Element {
  let { polls } = props;

  // Using react-query to fetch and refresh the vote count
  const { data } = useQuery({
    queryKey: ['fetchPollList'],
    queryFn: async () => {
      const data = await getPolls();
      return data;
    },
    enabled: true,
    refetchInterval: 5000, // refresh every 5 seconds
  });

  if (data) {
    polls = data;
  }

  const session = useSession();

  const pollCards = useMemo(() => {
    return (polls || []).map((poll) => {
      return (
        <Grid
          key={poll.id}
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
          alignSelf="stretch"
        >
          <PollCard poll={poll} />
        </Grid>
      );
    });
  }, [polls]);

  if (polls && polls.length > 0) {
    return (
      <Box display="flex" flexDirection="column" gap={2} width="100%">
        {session.status !== 'authenticated' && (
          <Typography textAlign="center">
            Anyone can browse the polls and view results without connecting a
            wallet:
          </Typography>
        )}
        <Grid
          container
          spacing={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {pollCards}
        </Grid>
      </Box>
    );
  } else {
    return (
      <Typography variant="h4" textAlign="center" fontWeight="bold">
        No polls yet.
      </Typography>
    );
  }
}
