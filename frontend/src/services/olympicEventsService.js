import olympicEventSchema from '../validation/olympicEventSchema';

const TIMEOUT_MS = 5000; // 5 seconds

export const getOlympicEvents = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch('/olympicEvents.json', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des épreuves');
        }

        const data = await response.json();

        // Validate each event's fields using the schema
        const validatedEvents = await Promise.all(
            data.map(async (event) => {
                try {
                    await olympicEventSchema.validate(event.fields, { abortEarly: false });
                    return event;
                } catch (validationError) {
                    console.error("Validation error for event:", event, validationError);
                    // Return null for invalid events
                    return null;
                }
            })
        );

        return validatedEvents.filter(event => event !== null);
    } catch (error) {
        // Distinguish between abort error and other errors
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
};
