import { useAuth0 } from '@auth0/auth0-react';

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

    return {
        isAuthenticated,
        isLoading,
        user,
        error,
        login: () => loginWithRedirect(),
        logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
        getAccessToken: () => getAccessTokenSilently(),
    };
};

export default useAuth;
