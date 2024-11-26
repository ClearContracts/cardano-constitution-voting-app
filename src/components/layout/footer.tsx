import Image from 'next/image';
import Link from 'next/link';
import clarity from '@/img/Clarity.png';
import { GitHub } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

/**
 * Footer with Clarity logo & link to repo
 * @returns Footer
 */
export function Footer(): JSX.Element {
  return (
    <Box
      sx={{
        position: 'static',
        bottom: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,

        height: '75px',
      }}
    >
      <Link
        href="https://www.clarity.community/"
        style={{ textDecoration: 'none' }}
        data-testid="clarity-link"
        target="_blank"
      >
        <Image src={clarity} width="200" height="50" alt="Powered by Clarity" />
      </Link>
      <Button
        href="https://github.com/ClearContracts/cardano-constitution-voting-app"
        target="_blank"
        data-testid="github-link"
        color="primary"
      >
        <GitHub />
      </Button>
    </Box>
  );
}
