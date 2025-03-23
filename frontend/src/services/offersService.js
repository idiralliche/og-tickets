import offerSchema from '../validation/offerSchema';

const TIMEOUT_MS = 5000; // 5 seconds timeout

export const getOffers = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Construct the backend URL using environment variables
    const backendUrl =
      process.env.REACT_APP_BACKEND_BASE_URL +
      process.env.REACT_APP_OFFERS_PATH;
    const response = await fetch(backendUrl, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Les offres ne sont pas disponibles pour le moment.');
      } else if (response.status === 500) {
        throw new Error('Erreur serveur, veuillez réessayer plus tard.');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('Accès refusé. Veuillez vérifier vos identifiants.');
      } else {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Format de réponse invalide.');
    }

    // Validate each offer using offerSchema
    const validatedOffers = await Promise.all(
      data.map(async (offer) => {
        try {
          await offerSchema.validate(offer, { abortEarly: false });
          return offer;
        } catch (validationError) {
          console.warn(
            'Offre invalide ignorée:',
            offer,
            validationError.errors
          );
          return null;
        }
      })
    );

    const filteredOffers = validatedOffers.filter((offer) => offer !== null);

    if (filteredOffers.length === 0) {
      throw new Error('Aucune offre valide trouvée.');
    }

    return []; //filteredOffers;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('La connexion avec le serveur a expiré.');
    }
    throw error;
  }
};
