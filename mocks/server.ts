import { setupServer } from 'msw/native';

import { getTransactionsMock } from '#/modules/transaction/data/api/transactionApiMock';

export const server = setupServer(getTransactionsMock);

server.events.on('request:match', ({ request }) => {
  // we can log the request here
  // eslint-disable-next-line no-console
  console.log('[MSW] Request matched:', request.url);
});

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});
afterEach(() => {
  server.resetHandlers();
});
