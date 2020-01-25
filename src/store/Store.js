import React, { createContext, useReducer } from 'react';


const initialState = {
    isAuthenticated: false
};

function checkSecrets( secret1, secret2 ) {
    if ( secret1 && secret1 === secret2 )
        return true;
    return false;
}

function reducer( state, action ) {
    switch( action.type ) {
        case 'LOGIN':
            console.log(action.type + ' received: ' + JSON.stringify(action.payload));
            return { ...state, isAuthenticated: checkSecrets( action.payload.secret1, action.payload.secret2 ) };
        default:
            return state;
    }
}; 

export const AuthenticationContext = createContext();
export function AuthenticationProvider ( props ) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const isAuthenticated = state.isAuthenticated;

    return (
        <AuthenticationContext.Provider value={{ isAuthenticated, dispatch }}>
            { props.children }
        </AuthenticationContext.Provider>
    );
};