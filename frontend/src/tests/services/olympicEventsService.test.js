import { getOlympicEvents } from '../../services/olympicEventsService';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocks
fetchMock.enableMocks();

describe('getOlympicEvents service', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        // Suppress console.error to avoid polluting test output
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        // Restore console.error after each test
        console.error.mockRestore();
    });

    test('should fetch and return validated events', async () => {
        const validData = [
            {
                model: "contests.contest",
                pk: 1,
                fields: {
                    sport: "Basketball",
                    name: "Men's Group Stage",
                    description: "Group C, Game 19",
                    date_time: "2024-07-31T17:15:00Z",
                    location: "Stade Pierre Mauroy"
                }
            }
        ];
        fetchMock.mockResponseOnce(JSON.stringify(validData));

        const events = await getOlympicEvents();
        expect(events).toEqual(validData);
    });

    test('should filter out invalid events', async () => {
        const dataWithInvalid = [
            {
                model: "contests.contest",
                pk: 1,
                fields: {
                    sport: "Basketball",
                    name: "Men's Group Stage",
                    description: "Group C, Game 19",
                    date_time: "2024-07-31T17:15:00Z",
                    location: "Stade Pierre Mauroy"
                }
            },
            {
                model: "contests.contest",
                pk: 2,
                fields: {
                    sport: "", // Invalid: empty string
                    name: "",
                    description: "",
                    date_time: "invalid-date",
                    location: ""
                }
            }
        ];
        fetchMock.mockResponseOnce(JSON.stringify(dataWithInvalid));

        const events = await getOlympicEvents();
        expect(events.length).toBe(1);
        expect(events[0].pk).toBe(1);
    });

    test('should throw an error for a non-OK response', async () => {
        // Simulate non-OK response (e.g., 404)
        fetchMock.mockResponseOnce('Not Found', { status: 404 });
        await expect(getOlympicEvents()).rejects.toBeInstanceOf(Error);
    });

    test('should throw a timeout error if the request takes too long', async () => {
        // Simulate a timeout by aborting the fetch
        fetchMock.mockAbortOnce();
        await expect(getOlympicEvents()).rejects.toBeInstanceOf(Error);
    });
});
