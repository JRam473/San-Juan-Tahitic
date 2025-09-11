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
import { Footer } from './Footer';

// 🔑 Importa tu AuthProvider y la página de Login
import { AuthProvider } from '@/hooks/useAuth'; 
import { Login } from './pages/Login'; // Asegúrate de crear esta página

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
      { path: 'login', element: <Login /> }, // 👈 Ahora dentro de App
    ],
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