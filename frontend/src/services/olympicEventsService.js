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
            if (response.status === 404) {
                throw new Error("Les événements ne sont pas disponibles pour le moment.");
            } else if (response.status === 500) {
                throw new Error("Erreur serveur, veuillez réessayer plus tard.");
            } else if (response.status === 401 || response.status === 403) {
                throw new Error("Accès refusé. Veuillez vérifier vos identifiants.");
            } else {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Format de réponse invalide.");
        }

        const validatedEvents = await Promise.all(
            data.map(async (event) => {
                try {
                    await olympicEventSchema.validate(event, { abortEarly: false });
                    return event;
                } catch (validationError) {
                    console.warn("Événement invalide ignoré:", event, validationError.errors);
                    return null;
                }
            })
        );

        const filteredEvents = validatedEvents.filter(event => event !== null);

        if (filteredEvents.length === 0) {
            throw new Error("Aucun événement valide trouvé.");
        }

        return filteredEvents;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error("La connexion avec le serveur a expiré.");
        }
        throw error;
    }
};
