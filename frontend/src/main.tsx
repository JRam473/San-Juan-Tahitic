// main.tsx - Corrección de rutas
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// App principal
import App from './App.tsx';

// Rutas
import { HomePage } from './pages/HomePage';
import { TourismSection } from './TourismSection';
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
import { ProfilePage } from './pages/ProfilePage'; // Descomenta si tienes esta página

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'turismo', element: <TourismSection /> },
      { path: 'cultura', element: <CultureSection /> },
      { path: 'comunidad', element: <CommunitySection /> },
      { path: 'galeria', element: <GallerySection /> },
      { path: 'contacto', element: <ContactSection /> },
      { path: 'login', element: <Login /> }, // ✅ Login dentro de App (para que tenga la navegación)
      
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
    path: '/oauth-callback',
    element: <OAuthCallback />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 🔑 Aquí envuelves toda tu app en AuthProvider */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);