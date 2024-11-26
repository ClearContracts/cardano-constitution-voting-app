import { useCallback, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { getServerSession } from 'next-auth';

import { checkIfCO } from '@/lib/checkIfCO';
import { useCheckAddressChange } from '@/hooks/useCheckAddressChange';
import { ManageActivePowerTable } from '@/components/coordinator/manageActivePowerTable';
import { ManageRepresentativesTable } from '@/components/coordinator/manageRepresentativesTable';

export default function ManageRepresentatives(): JSX.Element {
  useCheckAddressChange();
  const [refresh, setRefresh] = useState(false);

  const toggleRefresh = useCallback((): void => {
    setRefresh((prev) => !prev);
  }, []);

  return (
    <>
      <Head>
        <title>Constitutional Convention Voting App</title>
        <meta
          name="description"
          content="Voting app to be used by delegates at the Cardano Constitutional Convention in Buenos Aires to ratify the initial constitution. This voting app was commissioned by Intersect."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box display="flex" flexDirection="column" gap={6}>
          <Typography variant="h3" fontWeight="bold">
            Coordinator Dashboard
          </Typography>
          <ManageRepresentativesTable toggleRefresh={toggleRefresh} />
          <ManageActivePowerTable
            refresh={refresh}
            toggleRefresh={toggleRefresh}
          />
        </Box>
      </main>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<
  | {
      redirect: {
        destination: string;
        permanent: boolean;
      };
      props?: undefined;
    }
  | {
      props: object;
      redirect?: undefined;
    }
> => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const stakeAddress = session.user?.stakeAddress;

  const isCO = await checkIfCO(stakeAddress);

  if (!isCO) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
