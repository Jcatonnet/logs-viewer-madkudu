import { useAuth0 } from '@auth0/auth0-react';
import { useCallback } from 'react';

const useAuth = () => {
    const {
        isAuthenticated,
        loginWithRedirect,
        logout,
        isLoading,
        user,
        getAccessTokenSilently,
        error,
    } = useAuth0();

    const login = useCallback(() => loginWithRedirect(), [loginWithRedirect]);

    const logoutUser = useCallback(
        () => logout({ logoutParams: { returnTo: window.location.origin } }),
        [logout]
    );

    const getAccessToken = useCallback(() => getAccessTokenSilently(), [getAccessTokenSilently]);

    return {
        isAuthenticated,
        isLoading,
        user,
        error,
        login,
        logout: logoutUser,
        getAccessToken,
    };
};

export default useAuth;