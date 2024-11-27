import { useEffect, useMemo, useState } from 'react';
import {
  DoNotDisturbOutlined,
  HowToVoteOutlined,
  ThumbDownOutlined,
  ThumbUpOutlined,
} from '@mui/icons-material';
import {
  LinearProgress,
  linearProgressClasses,
  styled,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { calculateWinner } from '@/lib/calculateWinner';
import { DownloadPollVotesButton } from '@/components/buttons/downloadPollVotesButton';
import { PollResultsVoter } from '@/components/polls/pollResultsVoter';

interface Props {
  pollId: string;
  votes: {
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
}

const YesLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.palette.divider}`,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.success.main,
  },
}));

const NoLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.palette.divider}`,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.warning.main,
  },
}));

const AbstainLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.palette.divider}`,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
}));

/**
 * Shows the results of a poll
 * @param votes - The resulting votes of a poll
 * @returns Poll Results
 */
export function PollResults(props: Props): JSX.Element {
  const { votes, pollId } = props;

  const [percentage, setPercentage] = useState(-1);
  const [activeVoterCount, setActiveVoterCount] = useState(-1);

  const theme = useTheme();

  const voteCount = Object.values(votes || {}).reduce(
    (acc, curr) => acc + curr.length,
    0,
  );

  const yesCount = votes?.yes?.length || 0;
  const noCount = votes?.no?.length || 0;
  const abstainCount = votes?.abstain?.length || 0;

  const yesPercentage = Math.round((yesCount / voteCount) * 100) || 0;
  const noPercentage = Math.round((noCount / voteCount) * 100) || 0;
  const abstainPercentage = Math.round((abstainCount / voteCount) * 100) || 0;

  const yesVoters = useMemo((): JSX.Element => {
    return (
      <Box
        data-testid="yes-vote-results"
        display="flex"
        flexDirection="row"
        gap={1}
        flexWrap="wrap"
      >
        {votes?.yes?.map(({ name, id }) => {
          return (
            <Box key={id}>
              <PollResultsVoter name={name} id={id} vote="yes" />
            </Box>
          );
        })}
      </Box>
    );
  }, [votes]);

  const noVoters = useMemo((): JSX.Element => {
    return (
      <Box
        data-testid="no-vote-results"
        display="flex"
        flexDirection="row"
        gap={1}
        flexWrap="wrap"
      >
        {votes?.no?.map(({ name, id }) => {
          return (
            <Box key={id}>
              <PollResultsVoter name={name} id={id} vote="no" />
            </Box>
          );
        })}
      </Box>
    );
  }, [votes]);

  const abstainVoters = useMemo((): JSX.Element => {
    return (
      <Box display="flex" flexDirection="row" gap={1} flexWrap="wrap">
        {votes?.abstain?.map(({ name, id }) => {
          return (
            <Box key={id}>
              <PollResultsVoter name={name} id={id} vote="abstain" />
            </Box>
          );
        })}
      </Box>
    );
  }, [votes]);

  useEffect(() => {
    async function determineWinner(): Promise<void> {
      const results = await calculateWinner(votes);
      setPercentage(results.percentage);
      setActiveVoterCount(results.activeVoterCount);
    }
    if (votes) {
      determineWinner();
    }
  }, [votes]);

  return (
    <Box display="flex" flexDirection="column" gap={6} width="100%">
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent={'space-between'}
      >
        <Typography variant="h3" fontWeight="bold">
          Results
        </Typography>
        <DownloadPollVotesButton pollId={pollId} />
      </Box>

      {percentage !== -1 && (
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 1, sm: 3 }}
          alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            data-testid="acceptance-percentage"
          >
            {percentage}%
          </Typography>

          <Typography
            sx={{
              mb: 0.5,
            }}
          >
            {yesCount} of {activeVoterCount - abstainCount} Non-Abstaining
            Active Voters voted Yes
          </Typography>
        </Box>
      )}

      <Box display="flex" flexDirection="column" gap={6} width="100%">
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          data-testid="results-yes"
        >
          <Box display="flex" flexDirection="row" gap={1} alignItems="center">
            <Typography variant="h5" fontWeight="600">
              Voted:
            </Typography>
            <Typography color="success" variant="h5" fontWeight="600">
              YES
            </Typography>
            <ThumbUpOutlined color="success" />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            alignItems="center"
            color={theme.palette.text.primary}
          >
            <HowToVoteOutlined />
            <Typography data-testid="yes-count" role="landmark">
              {yesCount}
            </Typography>
            <Typography>vote{yesCount === 1 ? '' : 's'}</Typography>
            <Typography>|</Typography>
            <Typography data-testid="yes-percentage">
              {yesPercentage}%
            </Typography>
            <Typography>|</Typography>
            <Box sx={{ width: '100%' }}>
              <YesLinearProgress variant="determinate" value={yesPercentage} />
            </Box>
          </Box>
          {yesVoters}
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          data-testid="results-no"
        >
          <Box display="flex" flexDirection="row" gap={1} alignItems="center">
            <Typography variant="h5" fontWeight="600">
              Voted:
            </Typography>
            <Typography color="warning" variant="h5" fontWeight="600">
              NO
            </Typography>
            <ThumbDownOutlined color="warning" />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            alignItems="center"
            color={theme.palette.text.primary}
          >
            <HowToVoteOutlined />
            <Typography data-testid="no-count">{noCount}</Typography>
            <Typography>vote{noCount === 1 ? '' : 's'}</Typography>
            <Typography>|</Typography>
            <Typography data-testid="no-percentage">{noPercentage}%</Typography>
            <Typography>|</Typography>
            <Box sx={{ width: '100%' }}>
              <NoLinearProgress variant="determinate" value={noPercentage} />
            </Box>
          </Box>
          {noVoters}
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          data-testid="results-abstain"
        >
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            alignItems="center"
            color={theme.palette.text.primary}
          >
            <Typography variant="h5" fontWeight="600">
              Voted:
            </Typography>
            <Typography variant="h5" fontWeight="600">
              ABSTAIN
            </Typography>
            <DoNotDisturbOutlined />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            alignItems="center"
            color={theme.palette.text.primary}
          >
            <HowToVoteOutlined />
            <Typography data-testid="abstain-count">{abstainCount}</Typography>
            <Typography>vote{abstainCount === 1 ? '' : 's'}</Typography>
            <Typography>|</Typography>
            <Typography data-testid="abstain-percentage">
              {abstainPercentage}%
            </Typography>
            <Typography>|</Typography>
            <Box sx={{ width: '100%' }}>
              <AbstainLinearProgress
                variant="determinate"
                value={abstainPercentage}
              />
            </Box>
          </Box>
          {abstainVoters}
        </Box>
      </Box>
    </Box>
  );
}
