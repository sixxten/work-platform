import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthStore from './store/authStore';
import 'bootstrap/dist/css/bootstrap.min.css'; 

export const Context = createContext(null);

const auth = new AuthStore();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{ auth }}>
        <App />
    </Context.Provider>
);

