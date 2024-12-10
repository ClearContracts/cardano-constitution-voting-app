import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

import { User } from '@/types';

/**
 * Fetches data for a user by user id
 * @param userId - The user's id
 * @returns User - The user's information
 */
export async function getUser(userId: string | string[] | undefined): Promise<{
  user: User | null;
  message: string;
}> {
  try {
    if (userId && typeof userId === 'string') {
      const response = await axios.get(`/api/getUser/${userId}`, {
        headers: {
          'X-Custom-Header': 'intersect',
        },
      });
      const data = await response.data;
      if (response.status === 200) {
        if (data.user) {
          return {
            user: data.user,
            message: 'User found',
          };
        } else {
          return {
            user: null,
            message: data.message,
          };
        }
      } else {
        return {
          user: null,
          message: data.message,
        };
      }
    } else {
      console.log('UserI',userId);
      return {
        user: null,
        message: 'Invalid userId',
      };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { user: null, message: error.response.data.message };
    } else {
      return { user: null, message: 'An error occurred getting user' };
    }
  }
}
