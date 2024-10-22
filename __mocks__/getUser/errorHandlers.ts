import { http, HttpResponse } from 'msw';

export const getUserErrorHandlers = [
  http.get('/api/getUser', () => {
    return HttpResponse.json(
      {
        user: 'Could not find user',
      },
      { status: 404 },
    );
  }),
];
