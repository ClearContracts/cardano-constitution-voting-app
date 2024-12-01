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

export default function NewPoll(props: Props): JSX.Element {
  const { polls } = props;
  useCheckAddressChange();
  const [name, setName] = useState(
    'Shall the Cardano Constitution text, located at the link and with the hash as stated below, be approved for on-chain submission as a New Constitution governance action?',
  );
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
        <link rel="icon" type="img/png" href="/cardano.png" />
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
            multiline
            rows={2} // Number of visible rows
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
              <Typography
                variant="h6"
                fontWeight="600"
                data-testid="create-poll-warning"
              >
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
