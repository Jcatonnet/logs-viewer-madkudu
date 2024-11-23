import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const redirectUri = window.location.origin;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience,
        scope: 'read:current_user update:current_user_metadata',
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
