import olympicEventSchema from '../../validation/olympicEventSchema';

describe('olympicEventSchema', () => {
    test('should validate a valid event', async () => {
        const validEvent = {
            sport: 'Basketball',
            name: "Hommes, phase de groupe",
            date_time: '2024-07-31T17:15:00Z',
            location: 'Stade Pierre Mauroy',
            description: 'Group C, Jeu 19'
        };

        const validated = await olympicEventSchema.validate(validEvent);

        // Compare fields except date_time
        expect(validated).toMatchObject({
            sport: validEvent.sport,
            name: validEvent.name,
            location: validEvent.location,
            description: validEvent.description,
        });
        // Compare date_time as timestamp
        expect(validated.date_time.getTime()).toEqual(new Date(validEvent.date_time).getTime());
    });

    test('should fail when required fields are missing or invalid', async () => {
        const invalidEvent = {
            sport: '',
            name: '',
            date_time: 'invalid-date',
            location: '',
            description: ''
        };

        await expect(olympicEventSchema.validate(invalidEvent)).rejects.toThrow();
    });
});
