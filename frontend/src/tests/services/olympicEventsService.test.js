import { getOlympicEvents } from '../../services/olympicEventsService';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocks
fetchMock.enableMocks();

describe('getOlympicEvents service', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    // Suppress console.error to avoid polluting test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    console.error.mockRestore();
  });

  test('should fetch and return validated events', async () => {
    const validData = [
      {
        id: 1,
        sport: 'Basketball',
        name: 'Hommes, phase de groupe',
        description: 'groupe C, Jeu 19',
        date_time: '2024-07-31T17:15:00Z',
        location: 'Stade Pierre Mauroy',
      },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(validData));

    const events = await getOlympicEvents();
    expect(events).toEqual(validData);
  });

  test('should filter out invalid events', async () => {
    const dataWithInvalid = [
      {
        id: 1,
        sport: 'Basketball',
        name: 'Hommes, phase de groupe',
        description: 'groupe C, Jeu 19',
        date_time: '2024-07-31T17:15:00Z',
        location: 'Stade Pierre Mauroy',
      },
      {
        id: 2,
        sport: '', // Invalid: empty string
        name: '',
        description: '',
        date_time: 'invalid-date',
        location: '',
      },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(dataWithInvalid));

    const events = await getOlympicEvents();
    expect(events.length).toBe(1);
    expect(events[0].id).toBe(1);
  });

  test('should throw an error for a non-OK response', async () => {
    fetchMock.mockResponseOnce('Not Found', { status: 404 });
    await expect(getOlympicEvents()).rejects.toBeInstanceOf(Error);
  });

  test('Returns an error for a server error (500)', async () => {
    fetchMock.mockResponseOnce('', { status: 500 });
    await expect(getOlympicEvents()).rejects.toBeInstanceOf(Error);
  });

  test('Returns an error for unauthorized access (401/403)', async () => {
    fetchMock.mockResponseOnce('', { status: 403 });
    await expect(getOlympicEvents()).rejects.toBeInstanceOf(Error);
  });

  test('Returns an error if response is not a valid array', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: 'Invalid data' }));
    await expect(getOlympicEvents()).rejects.toBeInstanceOf(Error);
  });

  test('Returns an error if no valid events are found', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await expect(getOlympicEvents()).rejects.toBeInstanceOf(Error);
  });

  test('should throw a timeout error if the request takes too long', async () => {
    fetchMock.mockAbortOnce();
    await expect(getOlympicEvents()).rejects.toBeInstanceOf(Error);
  });
});
