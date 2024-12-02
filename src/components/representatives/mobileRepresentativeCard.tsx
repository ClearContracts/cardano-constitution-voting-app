import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckRounded, KeyboardArrowDownOutlined } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  useTheme,
} from '@mui/material';
import Typography from '@mui/material/Typography';

import type { User, Workshop } from '@/types';
import { paths } from '@/paths';
import { abbreviateName } from '@/lib/helpers/abbreviateName';
import { getUser } from '@/lib/helpers/getUser';

interface Props {
  representative: User;
  workshops: Workshop[];
}

/**
 * A Card showing information about a Representative
 * @param representative - Representative
 * @param workshops - List of Workshops
 * @returns Representative mobile card
 */
export function MobileRepresentativeCard(props: Props): JSX.Element {
  const { representative, workshops } = props;
  const [expanded, setExpanded] = useState<boolean>(false);
  const [delegate, setDelegate] = useState<User | null>(null);
  const [alternate, setAlternate] = useState<User | null>(null);

  const theme = useTheme();

  const workshop = useMemo(() => {
    return workshops.find(
      (workshop) => workshop.id === representative.workshop_id,
    );
  }, [representative]);

  useEffect(() => {
    async function fetchDelegates(): Promise<void> {
      if (workshop) {
        // lookup delegate
        const delegateId = workshop.delegate_id || '';
        const delegate = await getUser(delegateId);
        setDelegate(delegate.user);

        // lookup alternate
        const alternateId = workshop.alternate_id || '';
        const alternate = await getUser(alternateId);
        setAlternate(alternate.user);
      }
    }
    fetchDelegates();
  }, [workshop]);

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary
        sx={{
          p: 2,
        }}
        expandIcon={
          <Box
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            <KeyboardArrowDownOutlined />
          </Box>
        }
      >
        <Typography>{representative.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          p={2}
          borderTop={`1px solid ${theme.palette.divider}`}
        >
          <Typography variant="h6" fontWeight="600">
            Delegate:
          </Typography>
          <Box display="flex" flexDirection="row" gap={1}>
            {delegate ? (
              <Link
                href={paths.representatives.representative + delegate.id}
                style={{
                  color: '#FFFFFF',
                }}
              >
                <Typography variant="h6">
                  {delegate.name || 'Not Found'}
                </Typography>
              </Link>
            ) : (
              <Typography variant="h6">Not Found</Typography>
            )}
            {delegate?.id === workshop?.active_voter_id && (
              <CheckRounded color="success" />
            )}
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          p={2}
          borderTop={`1px solid ${theme.palette.divider}`}
        >
          <Typography variant="h6" fontWeight="600">
            Alternate:
          </Typography>
          <Box display="flex" flexDirection="row" gap={1}>
            {alternate ? (
              <Link
                href={paths.representatives.representative + alternate.id}
                style={{
                  color: '#FFFFFF',
                }}
              >
                <Typography variant="h6">
                  {alternate.name || 'Not Found'}
                </Typography>
              </Link>
            ) : (
              <Typography variant="h6">Not Found</Typography>
            )}

            {alternate?.id === workshop?.active_voter_id && (
              <CheckRounded color="success" />
            )}
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          p={2}
          borderTop={`1px solid ${theme.palette.divider}`}
        >
          <Typography variant="h6" fontWeight="600">
            Workshop:
          </Typography>
          <Box display="flex" flexDirection="row" gap={1}>
            <Typography variant="h6">
              {workshop?.name || 'Not Found'}
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          p={2}
          borderTop={`1px solid ${theme.palette.divider}`}
        >
          <Typography variant="h6" fontWeight="600">
            Active Voter:
          </Typography>
          <Box display="flex" flexDirection="row" gap={1}>
            <Typography variant="h6">
              {workshop?.active_voter_id === delegate?.id
                ? 'Delegate'
                : workshop?.active_voter_id === alternate?.id
                  ? 'Alternate'
                  : 'Not Found'}
            </Typography>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
