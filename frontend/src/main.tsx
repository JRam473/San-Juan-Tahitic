// main.tsx - Estructura final con MinimalLayout
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
import { MinimalLayout } from './MinimalLayout'; // 👈 Importar MinimalLayout

// Rutas
import { HomePage } from './pages/HomePage';
import { TourismSection } from './pages/TourismSection.tsx';
import { CultureSection } from '@/cultura/CultureSection';
import { CommunitySection } from './pages/CommunitySection.tsx';
import { GallerySection } from './pages/GallerySection.tsx';
import { ContactSection } from './ContactSection';
import { OAuthCallback } from './pages/OAuthCallback';
import { Login } from './pages/Login';

// 🔑 Importa tu AuthProvider
import { AuthProvider } from '@/hooks/useAuth'; 

// Importar ProtectedRoute y ProfilePage (si los tienes)
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfilePage } from './pages/ProfilePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // 👈 Layout completo con navbar, footer, etc.
    children: [
      { index: true, element: <HomePage /> },
      { path: 'turismo', element: <TourismSection /> },
      { path: 'cultura', element: <CultureSection /> },
      { path: 'comunidad', element: <CommunitySection /> },
      { path: 'galeria', element: <GallerySection /> },
      { path: 'contacto', element: <ContactSection /> },
      
      // 👇 Ruta protegida
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
    element: ( // 👈 Layout mínimo SOLO para login
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
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);