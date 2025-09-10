// src/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
const { pathname } = useLocation();

useEffect(() => {
    // "window.scrollTo(0, 0)" se desplaza a la parte superior de la página
    window.scrollTo(0, 0);
  }, [pathname]); // El efecto se ejecuta cada vez que 'pathname' cambia

  return null; // Este componente no renderiza nada, solo maneja el efecto secundario
}

export default ScrollToTop;