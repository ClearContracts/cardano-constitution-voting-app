import { http, HttpResponse } from 'msw';

export const getRepresentativesHandlers = [
  http.get('/api/getRepresentatives', () => {
    return HttpResponse.json([
      {
        id: BigInt(1).toString(),
        is_convention_organizer: false,
        is_delegate: true,
        is_alternate: false,
        workshop_id: BigInt(1).toString(),
        email: 'john@johnson.com',
        wallet_address: 'addr1isdufnpoasidjfopmaimdfmopisadj',
        name: 'John Johnson',
      },
      {
        id: BigInt(2).toString(),
        is_convention_organizer: false,
        is_delegate: false,
        is_alternate: true,
        workshop_id: BigInt(1).toString(),
        email: 'mike@mickelson.com',
        wallet_address: 'addr1oqwieuroijfvaondsfipoaapoidjf',
        name: 'Mike Mickelson',
      },
      {
        id: BigInt(3).toString(),
        is_convention_organizer: false,
        is_delegate: true,
        is_alternate: false,
        workshop_id: BigInt(2).toString(),
        email: 'jack@jackson.com',
        wallet_address: 'addr1kidjfsadjfoadspjfoaidsfadsop',
        name: 'Jack Jackson',
      },
      {
        id: BigInt(4).toString(),
        is_convention_organizer: false,
        is_delegate: false,
        is_alternate: true,
        workshop_id: BigInt(2).toString(),
        email: 'rob@robertson.com',
        wallet_address: 'addr1iwoiuwqxpoieujsoidpjfkfjhpqowmfoa',
        name: 'Robert Robertson',
      },
      {
        id: BigInt(5).toString(),
        is_convention_organizer: false,
        is_delegate: true,
        is_alternate: false,
        workshop_id: BigInt(3).toString(),
        email: 'connor@connorson.com',
        wallet_address: 'addr1opijpoiuoimnlkjipoujpoimlkkm',
        name: 'Connor Connorson',
      },
      {
        id: BigInt(6).toString(),
        is_convention_organizer: false,
        is_delegate: false,
        is_alternate: true,
        workshop_id: BigInt(3).toString(),
        email: 'kyle@kyleson.com',
        wallet_address: 'addr1adfasdfwerwqersdvfzxfvsadf',
        name: 'Kyle Kyleson',
      },
    ]);
  }),
];
