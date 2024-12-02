import { useMemo } from 'react';
import { Box, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';

import type { User, Workshop } from '@/types';
import { MobileRepresentativeCard } from '@/components/representatives/mobileRepresentativeCard';

interface Props {
  representatives: User[];
  workshops: Workshop[];
}

/**
 * A Table with all Representatives grouped by their Workshop for Mobile
 * @param representatives - List of Representatives
 * @param workshops - List of Workshops
 * @returns Representatives Table
 */
export function MobileRepresentativesTable(props: Props): JSX.Element {
  const { representatives, workshops } = props;

  const theme = useTheme();

  const representativesList = useMemo(() => {
    const repsOnly = representatives.filter((rep) => {
      // Filter out representatives that are not in workshop 1 (Convention Organizers)
      return BigInt(rep.workshop_id) !== BigInt(1);
    });
    return repsOnly.map((rep) => {
      return (
        <Box key={rep.id}>
          <MobileRepresentativeCard
            representative={rep}
            workshops={workshops}
          />
        </Box>
      );
    });
  }, [representatives]);

  if (representatives.length > 0) {
    return (
      <Box display="flex" flexDirection="column" gap={1} width="100%">
        <Typography variant="h5" fontWeight="600" textAlign="center">
          Representatives
        </Typography>
        {representativesList}
      </Box>
    );
  } else {
    return (
      <Typography variant="h4" textAlign="center">
        No representatives found.
      </Typography>
    );
  }
}
