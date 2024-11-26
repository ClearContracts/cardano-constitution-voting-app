import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Updates a user's name, email, and wallet address in the databas
 * @param userId - The ID of the user to update
 * @param name - The name of the user
 * @param email - The email of the user
 * @param wallet_address - The wallet address of the user
 * @returns UserId - The ID of the updated user
 * @returns Message - An error message if the user updating failed
 */
export async function updateUser(
  userId: string,
  name: string,
  email: string,
  wallet_address: string,
): Promise<{ userId: string; message: string }> {
  try {
    const response = await axios.post(
      '/api/updateUser',
      {
        userId: userId,
        name: name,
        email: email,
        wallet_address: wallet_address,
      },
      {
        headers: {
          'X-Custom-Header': 'intersect',
        },
      },
    );
    const data = await response.data;
    if (response.status === 200) {
      return { userId: data.userId, message: 'User info updated' };
    } else {
      return { userId: '-1', message: data.message };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { userId: '-1', message: error.response.data.message };
    } else {
      return { userId: '-1', message: 'An error occurred' };
    }
  }
}
