import toast from 'react-hot-toast';

/**
 * Moves a poll from voting to concluded
 * @param pollId - The ID of the poll to end voting on
 * @returns Boolean - True if the poll was successfully ended voting, false otherwise
 */
export async function endVoting(pollId: string): Promise<boolean> {
  const response = await fetch('/api/endVoting', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'intersect',
    },
    body: JSON.stringify({
      pollId: pollId,
    }),
  });
  const data = await response.json();
  if (response.status === 200) {
    toast.success('Poll voting is closed!');
    return data.pollId;
  } else {
    toast.error(data.message);
    return false;
  }
}