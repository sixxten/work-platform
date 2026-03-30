import { useEffect, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import { Context } from './index';
import { observer } from 'mobx-react-lite';

const App = observer(() => {
    const { auth } = useContext(Context);

    useEffect(() => {
        auth.checkAuth();
    }, [auth]);

    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    );
});

export default App;