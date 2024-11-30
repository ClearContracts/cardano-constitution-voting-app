import Image from 'next/image';
import Link from 'next/link';
import ccLogo from '@/img/cc-logo.png';
import clarity from '@/img/Clarity.png';
import gradient from '@/img/constitution-gradient.png';
import { GitHub } from '@mui/icons-material';
import { Box, Button, Divider, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { paths } from '@/paths';

/**
 * Footer with Clarity logo & link to repo
 * @returns Footer
 */
export function Footer(): JSX.Element {
  const theme = useTheme();
  return (
    <Grid
      container
      sx={{
        position: 'static',
        bottom: 0,
        left: 0,
        width: '100%',
        pt: 8,
        pb: 2,
        px: {
          xs: 2,
          sm: 4,
          md: 10,
          lg: 16,
        },
        background: 'rgb(13,26,61)',
        backgroundImage: `url(${gradient.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Grid
        size={{
          xs: 12,
          md: 4,
        }}
        sx={{ mt: 2 }}
      >
        <Link
          href="https://cardanoconvention.com/"
          style={{ textDecoration: 'none' }}
          data-testid="convention-link"
          target="_blank"
        >
          <Image
            src={ccLogo}
            width={168}
            height={25}
            alt="Constitutional Convention 2024"
          />
        </Link>
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 4,
        }}
        display="flex"
        flexDirection="column"
        gap={{
          xs: 1,
          md: 2,
        }}
        mt={{
          xs: 4,
          md: 0,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Useful links
        </Typography>
        <Link
          href="https://www.intersectmbo.org/"
          style={{ textDecoration: 'none' }}
          data-testid="intersect-link"
          target="_blank"
        >
          <Typography>Intersect</Typography>
        </Link>
        <Link
          href="https://2024constitutionalconsultation.docs.intersectmbo.org/"
          style={{ textDecoration: 'none' }}
          data-testid="docs-link"
          target="_blank"
        >
          <Typography>Docs</Typography>
        </Link>
        <Link
          href={paths.home}
          style={{ textDecoration: 'none' }}
          data-testid="intersect-link"
          target="_blank"
        >
          <Typography>Voting</Typography>
        </Link>
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 4,
        }}
        display="flex"
        flexDirection="column"
        gap={{
          xs: 1,
          md: 2,
        }}
        mt={{
          xs: 4,
          md: 0,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Social
        </Typography>
        <Link
          href="https://x.com/IntersectMBO"
          style={{ textDecoration: 'none' }}
          data-testid="x-link"
          target="_blank"
        >
          <Typography>X</Typography>
        </Link>
        <Link
          href="https://www.linkedin.com/company/intersectmbo/"
          style={{ textDecoration: 'none' }}
          data-testid="linkedin-link"
          target="_blank"
        >
          <Typography>LinkedIn</Typography>
        </Link>
      </Grid>
      <Box
        display="flex"
        flexDirection={{
          xs: 'column',
          md: 'row',
        }}
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        borderTop={`1px solid ${theme.palette.divider}`}
        mt={8}
        pt={2}
      >
        <Box display="flex" flexDirection="row" gap={4} alignItems="center">
          <Box display="flex" flexDirection="row" gap={1} alignItems="center">
            <Typography>Built by </Typography>
            <Link
              href="https://www.clarity.community/"
              style={{ textDecoration: 'none' }}
              data-testid="clarity-link"
              target="_blank"
            >
              <Image
                src={clarity}
                width="150"
                height="37.5"
                alt="Built by Clarity"
              />
            </Link>
          </Box>
          <Typography color={theme.palette.divider}>|</Typography>
          <Link
            href="https://github.com/ClearContracts/cardano-constitution-voting-app"
            style={{ textDecoration: 'none' }}
            data-testid="github-link"
            target="_blank"
          >
            <Typography>GitHub</Typography>
          </Link>
        </Box>
        <Typography>
          © {new Date().getFullYear()}. Intersect. All Rights Reserved.
        </Typography>
      </Box>
    </Grid>
  );
}
