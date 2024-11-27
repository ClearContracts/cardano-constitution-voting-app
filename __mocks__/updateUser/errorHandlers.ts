import { http, HttpResponse } from 'msw';

export const updateUserActiveVoteHandler = [
  http.post('/api/updateUser', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message:
          'You cannot update user information while a Poll is actively voting.',
      },
      { status: 400 },
    );
  }),
];

export const updateUserNoNameHandler = [
  http.post('/api/updateUser', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message: 'Name must be provided.',
      },
      { status: 400 },
    );
  }),
];

export const updateUserNoEmailHandler = [
  http.post('/api/updateUser', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message: 'Email must be provided.',
      },
      { status: 400 },
    );
  }),
];

export const updateUserNoWalletAddressHandler = [
  http.post('/api/updateUser', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message: 'Wallet address must be provided.',
      },
      { status: 400 },
    );
  }),
];

export const updateUserTooLongNameHandler = [
  http.post('/api/updateUser', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message: 'Name must be less than 100 characters.',
      },
      { status: 400 },
    );
  }),
];

export const updateUserTooLongEmailHandler = [
  http.post('/api/updateUser', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message: 'Email must be less than 100 characters.',
      },
      { status: 400 },
    );
  }),
];

export const updateUserTooLongWalletAddressHandler = [
  http.post('/api/updateUser', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message: 'Wallet Address must be less than 100 characters.',
      },
      { status: 400 },
    );
  }),
];

export const updateUserInternalErrorHandler = [
  http.post('/api/updateUser', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message: 'Error updating User Information.',
      },
      { status: 500 },
    );
  }),
];

export const updateUserInvalidSessionHandler = [
  http.post('/api/updateUser', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message:
          'You must be signed in as an Organizer update user information.',
      },
      { status: 401 },
    );
  }),
];

export const updateUserNotOrganizerHandler = [
  http.post('/api/updateUser', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message: 'You must be an Organizer to update user information.',
      },
      { status: 401 },
    );
  }),
];
