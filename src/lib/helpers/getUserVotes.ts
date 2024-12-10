import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

import { PollVote } from '@/types';

/**
 * Gets all of a user's votes by their id
 * @param userId - The user's id
 * @returns User - The user's votes
 */
export async function getUserVotes(
  userId: string | string[] | undefined,
): Promise<{ votes: PollVote[]; message: string }> {
  try {
    if (userId && typeof userId === 'string') {
      const response = await axios.get(`/api/getUserVotes/${userId}`, {
        headers: {
          'X-Custom-Header': 'intersect',
        },
      });
      const data = await response.data;
      if (response.status === 200) {
        if (data.votes) {
          return { votes: data.votes, message: 'User votes found' };
        } else {
          return { votes: [], message: data.message };
        }
      } else {
        return { votes: [], message: data.message };
      }
    } else {
      console.log('UserId',userId);
      return { votes: [], message: 'Invalid userId' };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { votes: [], message: error.response.data.message };
    } else {
      return { votes: [], message: "An error occurred getting user's vote" };
    }
  }
}
