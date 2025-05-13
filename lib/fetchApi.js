// /lib/fetchApi.js

export async function fetchApi(url, options = {}) {
  try {
    const { body, ...rest } = options;

    const response = await fetch(url, {
      ...rest,
      credentials: "include", // Toujours inclure les cookies sécurisés
      headers: {
        'Content-Type': 'application/json',
        ...(rest.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Gestion d'erreurs HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Erreur HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    // Retourner la réponse JSON directement
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`❌ fetchApi error [${url}] :`, error.message);
    throw error;
  }
}
