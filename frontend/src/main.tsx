import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30_000,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

// If we have a stored token but not a user object, fetch the profile on app start.
import { useSessionStore } from './store/sessionStore';
import { meRequest } from './api/auth';

const tokenOnStart = useSessionStore.getState().token;
const userOnStart = useSessionStore.getState().user;
if (tokenOnStart && !userOnStart) {
  queryClient
    .fetchQuery(['me'], meRequest)
    .then((user) => {
      // Reinstate token and set fetched user
      useSessionStore.getState().setSession({ token: tokenOnStart, user });
    })
    .catch(() => {
      // If fetching profile fails (expired token), clear session
      useSessionStore.getState().clearSession();
    });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#05040A',
              color: '#fff',
              border: '1px solid rgba(0,245,255,0.4)',
            },
          }}
        />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);

