import React from 'react';

export const AuthenticationContext = React.createContext();

const initialState = {
    isAuthenticated: false,
    secret1: null,
    secret2: null
};

function reducer( state, action ) {
    switch( action.type ) {
        case 'LOGIN':
            console.log(action.type + ' received');
            return { ...state };
        default:
            return state;
    }
}; 

export function AuthenticationProvider ( props ) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const isAuthenticated = state.isAuthenticated;

    return (
        <AuthenticationContext.Provider value={{ isAuthenticated, dispatch }}>
            { props.children }
        </AuthenticationContext.Provider>
    );
};