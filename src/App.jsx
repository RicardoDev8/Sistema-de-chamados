
import { BrowserRouter } from 'react-router-dom';
import RoutesApp from './routes';

import AuthProvider from './contexts/auth';

import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer autoClose={3000} />
        <RoutesApp />
      </AuthProvider>
    </BrowserRouter>
  );
}

