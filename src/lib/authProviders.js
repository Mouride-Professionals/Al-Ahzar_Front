export const keycloakProvider = {
  id: 'keycloak',
  name: 'Keycloak',
  credentials: {
    username: { label: "Nom d'utilisateur", type: 'text' },
    password: { label: 'Mot de passe', type: 'password' },
  },
  async authorize(credentials) {
    try {
      const response = await fetch(
        `${process.env.KEYCLOAK_BASE_URL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            username: credentials.username,
            password: credentials.password,
            grant_type: 'password',
          }),
        }
      );
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error_description || 'Invalid credentials');

      return {
        id: data.sub,
        name: data.name,
        email: data.email,
        token: data.access_token,
      };
    } catch (error) {
      console.error('Keycloak authentication error:', error);
      throw new Error("Erreur d'authentification Keycloak");
    }
  },
};

export const strapiProvider = {
  id: 'strapi',
  name: 'Strapi',
  credentials: {
    identifier: { label: 'Email', type: 'email' },
    password: { label: 'Mot de passe', type: 'password' },
  },
  async authorize(credentials) {
    try {
      const response = await fetch(
        `${process.env.STRAPI_BASE_URL}/auth/local`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: credentials.username,
            password: credentials.password,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok || !data.jwt)
        throw new Error(data.error.message || 'Invalid credentials');

      return {
        id: data.user.id,
        firstName: data.user.firstname,
        lastName: data.user.lastname,
        username: data.user.username,
        email: data.user.email,
        token: data.jwt,
      };
    } catch (error) {
      console.error('Strapi authentication error:', error);
      throw new Error("Erreur d'authentification Strapi");
    }
  },
};
