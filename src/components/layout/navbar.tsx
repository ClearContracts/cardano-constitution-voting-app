import Link from 'next/link';
import { Box, Typography } from '@mui/material';

import { paths } from '@/paths';
import { ConnectWalletButton } from '@/components/buttons/connectWalletButton';

/**
 * Navbar component with home link & connect wallet button
 * @returns Navbar
 */
export function Navbar(): JSX.Element {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height: '75px',
      }}
    >
      <Link
        href={paths.home}
        style={{ textDecoration: 'none' }}
        data-testid="home-link"
      >
        <Typography variant="h6" fontWeight="bold">
          Voting Tool
        </Typography>
      </Link>
      <ConnectWalletButton />
    </Box>
  );
}
