// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// App principal (layout completo)
import App from './App.tsx';

// Layout mínimo para login
import { MinimalLayout } from './MinimalLayout';

// Rutas
import { HomePage } from './pages/HomePage';
import { TourismSection } from './pages/TourismSection.tsx';
import { CulturePage } from './pages/CulturePage';
import { CommunitySection } from './pages/CommunitySection.tsx';
import { GallerySection } from './pages/GallerySection.tsx';
import { ContactSection } from './ContactSection';
import { OAuthCallback } from './pages/OAuthCallback';
import { Login } from './pages/Login';

// Importar AuthProvider
import { AuthProvider } from '@/hooks/useAuth'; 

// Importar ProtectedRoute y ProfilePage
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfilePage } from './pages/ProfilePage';

// Importar ToastProvider
import { ToastProvider } from '@/components/ui/toast'; // 👈 Importar ToastProvider

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'turismo', element: <TourismSection /> },
      { path: 'cultura', element: <CulturePage /> },
      { path: 'comunidad', element: <CommunitySection /> },
      { path: 'galeria', element: <GallerySection /> },
      { path: 'contacto', element: <ContactSection /> },
      {
        path: 'perfil',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      }
    ],
  },
  {
    path: '/login',
    element: (
      <MinimalLayout>
        <Login />
      </MinimalLayout>
    ),
  },
  {
    path: '/oauth-callback',
    element: <OAuthCallback />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider> {/* 👈 Envolver con ToastProvider */}
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
);