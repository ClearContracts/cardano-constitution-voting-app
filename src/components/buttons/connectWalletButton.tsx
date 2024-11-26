import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { walletOptions } from '@/constants/walletOptions';
import { useWalletContext } from '@/context/WalletContext';
import CircleRounded from '@mui/icons-material/CircleRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { signOut, useSession } from 'next-auth/react';

import type { User } from '@/types';
import { paths } from '@/paths';
import { connectWallet } from '@/lib/connectWallet';
import { getUser } from '@/lib/helpers/getUser';

interface Props {
  isHomepage?: boolean;
}

/**
 * A button to connect a wallet to a variety of cip-30 compatible wallets
 * @returns Connect Wallet Button
 */
export function ConnectWalletButton(props: Props): JSX.Element {
  const { isHomepage } = props;
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [connecting, setConnecting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const session = useSession();
  const theme = useTheme();
  const { updateWallet } = useWalletContext();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    setAnchorEl(event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
  }

  function handleClose(): void {
    setAnchorEl(null);
    setOpen(false);
  }

  // dropdown menu to select Cardano wallet from available wallets in browser
  const wallets = useMemo(() => {
    async function connect(walletName: string): Promise<void> {
      setConnecting(true);
      await connectWallet(walletName, updateWallet);
      setConnecting(false);
      handleClose();
    }

    // filter wallets by the wallets this browser has installed
    let userWallets;
    if (typeof window !== 'undefined') {
      userWallets = walletOptions.filter(
        // @ts-expect-error cardano is actually a proper function on windows
        (wallet) => window?.cardano?.[Object.keys(wallet)[0]],
      );
    } else {
      userWallets = walletOptions;
    }

    const userWalletButtons = userWallets.map((wallet) => {
      const walletName = Object.values(wallet)[0];
      const walletConnectName = Object.keys(wallet)[0];
      return (
        <MenuItem
          onClick={() => {
            handleClose();
            connect(walletConnectName);
          }}
          disabled={connecting}
          key={walletName}
          sx={{
            minWidth: '200px',
            fontWeight: 500,
          }}
          data-testid={`connect-wallet-${walletName}`}
        >
          {walletName}
        </MenuItem>
      );
    });

    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {user && (
          <Link
            href={paths.representatives.representative + user?.id}
            onClick={handleClose}
            style={{
              textDecoration: 'none',
            }}
          >
            <MenuItem
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                alignSelf="flex-start"
                color="rgba(255, 255, 255, 0.5)"
              >
                Logged in
              </Typography>
              <Box
                display="flex"
                flexDirection="row"
                gap={1}
                alignItems="center"
              >
                <PersonRounded color="success"></PersonRounded>
                <Typography color={theme.palette.success.main}>
                  {user?.name}
                </Typography>
              </Box>
            </MenuItem>
          </Link>
        )}
        {session.status === 'authenticated' ? (
          <MenuItem
            sx={{
              minWidth: '200px',
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => signOut({ callbackUrl: '/' })}
              fullWidth
              data-testid="disconnect-wallet"
            >
              Disconnect
            </Button>
          </MenuItem>
        ) : (
          userWalletButtons
        )}
      </Menu>
    );
  }, [
    anchorEl,
    open,
    connecting,
    session,
    theme.palette.success.main,
    user,
    updateWallet,
  ]);

  // Lookup user information from session
  useEffect(() => {
    async function fetchUserData(): Promise<void> {
      if (session.status === 'authenticated') {
        const user = await getUser(session.data.user.id);
        if (user.user) {
          setUser(user.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
    fetchUserData();
  }, [session.status, session.data?.user.id]);

  return (
    <Box display="flex" flexDirection="row" gap={1} alignItems="center">
      {session.status === 'authenticated' && (
        <Typography
          fontWeight="500"
          display={{
            xs: 'none',
            md: 'flex',
          }}
        >
          Welcome
        </Typography>
      )}
      <Button
        variant={isHomepage ? 'contained' : 'outlined'}
        color={
          isHomepage
            ? 'secondary'
            : session.status === 'authenticated'
              ? 'success'
              : 'warning'
        }
        sx={{
          px: isHomepage
            ? {
                xs: 12,
                sm: 16,
              }
            : 2,
          py: isHomepage ? 2 : 1,
          borderRadius: '40px',
        }}
        disabled={connecting}
        id="connect-wallet"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={
          isHomepage ? (
            <></>
          ) : session.status === 'authenticated' ? (
            <Box
              sx={{
                fontSize: '0.85rem !important',
              }}
              justifyContent="center"
              display="flex"
            >
              <CircleRounded fontSize="inherit" />
            </Box>
          ) : (
            <Box
              sx={{
                fontSize: '0.85rem !important',
              }}
              justifyContent="center"
              display="flex"
            >
              <CircleRounded fontSize="inherit" />
            </Box>
          )
        }
        data-testid="connect-wallet-button"
      >
        <Typography
          noWrap
          sx={{
            maxWidth: '150px',
            minWidth: '70px',
            overflow: 'hidden',
            fontWeight: 500,
            color: isHomepage
              ? theme.palette.secondary.contrastText
              : theme.palette.success.contrastText,
          }}
        >
          {session.status === 'authenticated'
            ? session.data.user.name
            : isHomepage
              ? 'Connect a wallet'
              : '-'}
        </Typography>
      </Button>
      {isHomepage ? (
        <></>
      ) : session.status === 'authenticated' ? (
        <Typography
          color="success"
          fontWeight="500"
          display={{
            xs: 'none',
            md: 'flex',
          }}
        >
          Wallet connected
        </Typography>
      ) : (
        <Typography
          color="warning"
          fontWeight="500"
          display={{
            xs: 'none',
            md: 'flex',
          }}
        >
          Wallet not connected
        </Typography>
      )}

      {wallets}
    </Box>
  );
}
