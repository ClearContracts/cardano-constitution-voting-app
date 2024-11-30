import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Gets the transaction ids of all poll transactions
 * @param pollId - The ID of the poll to get results for
 * @returns String[] - Array of transaction IDs
 */
export async function getPollTransactions(pollId: string): Promise<string[]> {
  try {
    if (pollId) {
      const response = await axios.get(`/api/getPollTransactions/${pollId}`, {
        method: 'GET',
        headers: {
          'X-Custom-Header': 'intersect',
        },
      });
      const data = await response.data;
      if (response.status === 200) {
        return data;
      } else {
        return [];
      }
    } else {
      return [];
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return [];
    } else {
      return [];
    }
  }
}
