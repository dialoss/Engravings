import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Auth from "./components/Auth";
import {GoogleOAuthProvider} from '@react-oauth/google';

const CLEINT_ID = '1024510478167-dufqr18l2g3nmt7gkr5rakc9sjk5nf54.apps.googleusercontent.com';

const AuthContainer = ({children}) => {
    return (
        <GoogleOAuthProvider clientId={CLEINT_ID}>
            <Auth>{children}</Auth>
        </GoogleOAuthProvider>
    );
};

export default AuthContainer;