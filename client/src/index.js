import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthStore from './store/authStore';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        auth: new AuthStore()
    }}>
        <App />
    </Context.Provider>
);