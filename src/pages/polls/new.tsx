import { ChangeEvent, useState } from 'react';
import Head from 'next/head';
import { Alert, Box, TextField, Typography } from '@mui/material';

import type { Poll } from '@/types';
import { pollsDto } from '@/data/pollsDto';
import { useCheckAddressChange } from '@/hooks/useCheckAddressChange';
import { CreatePollButton } from '@/components/buttons/createPollButton';

interface Props {
  polls: Poll[];
}

/**
 * Page to create a new poll
 * @param polls - Array of polls
 * @returns Page to create a new poll
 */
export default function NewPoll(props: Props): JSX.Element {
  const { polls } = props;
  useCheckAddressChange();
  const [name, setName] = useState(`Poll #${polls.length + 1}`);
  const [constitutionText, setConstitutionText] = useState('');
  const [link, setLink] = useState('');

  const isPendingOrVotingPoll = polls.some(
    (poll) => poll.status === 'pending' || poll.status === 'voting',
  );

  const shouldDisableCreateButton =
    !name || !constitutionText || !link || isPendingOrVotingPoll;

  // const hashedText = useMemo(() => {
  //   return blake.blake2bHex(constitutionText, undefined, 32);
  // }, [constitutionText]);

  return (
    <>
      <Head>
        <title>Constitutional Convention Voting App</title>
        <meta
          name="description"
          content="Voting app to be used by delegates at the Cardano Constitutional Convention in Buenos Aires to ratify the initial constitution. This voting app was commissioned by Intersect."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🗳️</text></svg>"
        />
      </Head>
      <main>
        <Box display="flex" flexDirection="column" gap={3}>
          <Typography variant="h4" fontWeight="bold">
            Create a new poll
          </Typography>
          <TextField
            variant="outlined"
            type="text"
            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
              setName(event.target.value);
            }}
            label="Name"
            value={name}
            data-testid="poll-name-input"
          />
          <TextField
            variant="outlined"
            type="text"
            autoComplete="off"
            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
              setLink(event.target.value);
            }}
            label="Link"
            value={link}
            data-testid="poll-link-input"
            placeholder="https://"
          />
          <TextField
            variant="outlined"
            type="text"
            autoComplete="off"
            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
              setConstitutionText(event.target.value);
            }}
            label="Constitution Text Hash"
            value={constitutionText}
            data-testid="poll-constitution-text-input"
          />
          {isPendingOrVotingPoll && (
            <Alert severity="warning" variant="outlined">
              <Typography variant="h6" fontWeight="600">
                You cannot create a new poll while there are pending or voting
                polls. End any open poll then return to this page to create a
                new poll.
              </Typography>
            </Alert>
          )}
          <CreatePollButton
            name={name}
            hashedText={constitutionText}
            link={link}
            setName={setName}
            setConstitutionText={setConstitutionText}
            setLink={setLink}
            disabled={shouldDisableCreateButton}
          />
        </Box>
      </main>
    </>
  );
}

export const getServerSideProps = async (): Promise<{
  props: {
    polls: Poll[];
  };
}> => {
  const polls = await pollsDto();

  return {
    props: {
      polls: polls,
    },
  };
};
