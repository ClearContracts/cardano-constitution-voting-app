import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';

import { paths } from '@/paths';
import { newPoll } from '@/lib/helpers/newPoll';

interface Props {
  name: string;
  hashedText: string;
  link: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setConstitutionText: React.Dispatch<React.SetStateAction<string>>;
  setLink: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
}

/**
 * A button for workshop coordinators to create a new poll
 * @param name - The name of the poll
 * @param hashedText - The hashed text of the poll
 * @param link - The link to the poll
 * @param setName - The function to set the name of the poll
 * @param setConstitutionText - The function to set the text of the poll
 * @param setLink - The function to set the link of the poll
 * @param disabled - Whether the button is disabled
 * @returns Create Poll Button
 */
export function CreatePollButton(props: Props): JSX.Element {
  const {
    name,
    hashedText,
    link,
    setName,
    setConstitutionText,
    setLink,
    disabled,
  } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  // call new poll api with this name & description
  async function handleCreatePoll(): Promise<void> {
    setIsSubmitting(true);
    const createdPoll = await newPoll(name, hashedText, link);
    setIsSubmitting(false);

    const newPollId = createdPoll.pollId;

    if (newPollId !== '-1') {
      toast.success('Poll created! You will be redirected.');
      // successful creation, clear form & redirect to poll
      setName('');
      setConstitutionText('');
      setLink('');
      router.push(paths.polls.poll + newPollId);
    } else {
      toast.error(createdPoll.message);
    }
  }

  return (
    <Button
      onClick={handleCreatePoll}
      variant="contained"
      disabled={disabled || isSubmitting}
      data-testid="create-poll-button"
    >
      Submit
    </Button>
  );
}
