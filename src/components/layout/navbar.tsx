import Image from 'next/image';
import Link from 'next/link';
import ccLogo from '@/img/cc-logo.svg';
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
        backgroundColor: 'rgb(8, 13, 23)',
        py: 2,
        px: {
          xs: 2,
          sm: 4,
          md: 10,
          lg: 16,
        },
        height: '75px',
        zIndex: 100,
      }}
    >
      <Box display="flex" flexDirection="row" gap={4} alignItems="center">
        <Link
          href={'https://cardanoconvention.com/'}
          style={{ textDecoration: 'none' }}
          data-testid="home-logo"
          target="_blank"
        >
          <Image
            src={ccLogo}
            alt="Constitutional Convention Logo"
            width={168}
            height={25}
          />
        </Link>
        <Box display={{ xs: 'none', sm: 'flex' }}>
          <Link
            href={paths.home}
            style={{
              textDecoration: 'none',
            }}
            data-testid="home-link"
          >
            <Typography variant="h6" fontWeight="bold">
              Voting Tool
            </Typography>
          </Link>
        </Box>
      </Box>

      <ConnectWalletButton />
    </Box>
  );
}
