import Image from 'next/image';
import Link from 'next/link';
import ccLogo from '@/img/cc-logo.png';
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
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
        px: {
          xs: 2,
          sm: 4,
          md: 10,
          lg: 16,
        },
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height: '75px',
      }}
    >
      <Box display="flex" flexDirection="row" gap={4} alignItems="center">
        <Link
          href={paths.home}
          style={{ textDecoration: 'none' }}
          data-testid="home-logo"
        >
          <Box
            display={{
              xs: 'none',
              sm: 'flex',
            }}
          >
            <Image
              src={ccLogo}
              alt="Constitutional Convention Logo"
              width={168}
              height={25}
            />
          </Box>
          <Box
            display={{
              xs: 'flex',
              sm: 'none',
            }}
          >
            <Image
              src={ccLogo}
              alt="Constitutional Convention Logo"
              width={100.8}
              height={15}
            />
          </Box>
        </Link>
        <Box display={{ xs: 'none', md: 'flex' }}>
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
