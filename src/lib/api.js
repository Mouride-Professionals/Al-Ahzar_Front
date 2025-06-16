import axios from 'axios';

// Crée une instance Axios avec la configuration de base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_BASE_URL || 'https://al-ahzar-backend-xeuc.onrender.com/api', //'http://109.123.246.253:1338/api', // URL de base pour les appels API
  timeout: 10000, // Temps limite pour une requête
  headers: {
    'Content-Type': 'application/json',
  },
});

// Middleware pour inclure le token d'authentification dans chaque requête
// Add interceptor to inject token dynamically
// api.interceptors.request.use(
//     async (config) => {
//         try {
//             const session = await getSession(); // Retrieve the session
//             if (session?.user?.accessToken) {
//                 config.headers.Authorization = `Bearer ${session.user.accessToken}`;
//             }
//         } catch (error) {
//             console.error('Failed to retrieve session for token:', error);
//         }
//         return config;
//     },
//     (error) => {
//         console.error('Request configuration error:', error);
//         return Promise.reject(error);
//     }
// );


// api.interceptors.request.use(async (config) => {
//   // Fetch the active school year from localStorage or API



//   // Append schoolYear to requests that need it
//   if (config.url.includes('%activeSchoolYear') && activeSchoolYear) {
//     config.url = config.url.replace('%activeSchoolYear', activeSchoolYear);


//   }

//   return config;
// }, (error) => Promise.reject(error));


// Middleware pour gérer les erreurs des réponses API
api.interceptors.response.use(
  (response) => {
    // Retourner directement la réponse si tout est OK
    return response;
  },
  (error) => {
    if (error.response) {
      // Gérer les erreurs spécifiques en fonction du code HTTP
      const status = error.response.status;
      if (status === 401) {
        console.error(
          'Erreur 401 : Non autorisé. Veuillez vérifier vos identifiants.'
        );
        // Rediriger vers la page de login ou effectuer une déconnexion
        // window.location.href = '/auth/login'; // Redirect on token expiration
      } else if (status === 404) {
        console.error('Erreur 404 : Ressource introuvable.');
      } else if (status >= 500) {
        console.error('Erreur serveur. Veuillez réessayer plus tard.');
      }
    } else {
      console.error('Erreur réseau ou autre problème :', error.message);
    }
    return Promise.reject(error);
  }
);

//    serverFetcher method
export const serverFetch = async ({ uri, user_token }) => {

  try {
    const response = await api.get(uri, {
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.response || error.message);
    return error.response?.data?.error?.message ||
      error.message ||
      'API request failed';
  }
};

// Fetcher method
export const fetcher = async ({ uri, options = {}, user_token }) => {

  try {

    const { method = 'GET', body, headers, params } = options;

    const response = await api({
      url: uri,
      method,
      headers: {
        ...headers,
        Authorization: user_token ? `Bearer ${user_token}` : undefined, // Add user token if provided
      },
      data: body || undefined, // Use data for POST/PUT requests
      params: params || undefined, // Query parameters for GET requests
    });

    return response.data;
  } catch (error) {
    console.error('Fetcher error:', error.response || error.message);
    // Throw a custom error object with more details
    throw {
      status: error.response?.status || 500, // HTTP status code
      message: error.response?.data?.error?.message || error.message || 'API request failed',
      data: error.response?.data || null, // Additional error data
    };
  }
};

export default api;
