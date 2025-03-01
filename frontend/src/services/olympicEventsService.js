import olympicEventSchema from '../validation/olympicEventSchema';

const TIMEOUT_MS = 5000; // 5 seconds

export const getOlympicEvents = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const backendUrl = process.env.REACT_APP_BACKEND_BASE_URL + process.env.REACT_APP_OLYMPIC_EVENTS_PATH;
        const response = await fetch(backendUrl, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des épreuves');
        }

        const data = await response.json();

        // Validation des événements directement sur l'objet plat
        const validatedEvents = await Promise.all(
            data.map(async (event) => {
                try {
                    // Validation sur l'objet event directement
                    await olympicEventSchema.validate(event, { abortEarly: false });
                    return event;
                } catch (validationError) {
                    console.error("Validation error for event:", event, validationError);
                    // Retourne null pour les événements invalides
                    return null;
                }
            })
        );

        return validatedEvents.filter(event => event !== null);
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
};
