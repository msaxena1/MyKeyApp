import React, { createContext, useReducer } from 'react';

const initialState = {
    s1: undefined,
    s2: undefined
};

function reducer( state, action ) {
    switch( action.type ) {
        case 'LOGIN':
            console.log(action.type + ' received: ' + JSON.stringify(action.payload.key));
            return { ...state,
                s1 : action.payload.secret1,
                s2: action.payload.secret2 
            };
        default:
            console.log(' received: default' );
            return state;
    }
}; 

export const AuthenticationContext = createContext();
export function AuthenticationProvider ( props ) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const s1 = state.s1;
    const s2 = state.s2;

    return (
        <AuthenticationContext.Provider value={{ s1, s2, dispatch }}>
            { props.children }
        </AuthenticationContext.Provider>
    );
};