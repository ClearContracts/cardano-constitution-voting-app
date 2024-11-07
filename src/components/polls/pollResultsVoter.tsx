import Link from 'next/link';
import { Box, Tooltip, Typography, useTheme } from '@mui/material';

import { paths } from '@/paths';

interface Props {
  name: string;
  id: string;
  vote: string;
}

export function PollResultsVoter(props: Props): JSX.Element {
  const { name, id, vote } = props;

  const theme = useTheme();
  return (
    <Box
      sx={{
        borderRadius: '50%',
        borderColor:
          vote === 'no'
            ? theme.palette.warning.main
            : vote === 'yes'
              ? theme.palette.success.main
              : theme.palette.text.primary,
        borderWidth: '1px',
        borderStyle: 'solid',
        width: 40,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:
          vote === 'no'
            ? 'rgba(245, 148, 77, 0.1)'
            : vote === 'yes'
              ? 'rgba(77,166,77, 0.1)'
              : 'rgba(77,107,179, .25)',
      }}
    >
      <Link
        href={paths.representatives.representative + id}
        style={{
          textDecoration: 'none',
        }}
        data-testid={`representative-vote-${id}`}
      >
        <Tooltip
          title={
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography>{name}</Typography>
            </Box>
          }
        >
          <Typography color="warning" fontWeight="700">
            {name.split(' ')[0][0]}
            {name.split(' ')[1][0]}
          </Typography>
        </Tooltip>
      </Link>
    </Box>
  );
}
