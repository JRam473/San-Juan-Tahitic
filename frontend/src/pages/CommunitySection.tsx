import { CooperativaSection } from '@/comunidad/CooperativaSection';
import FloraLocalSection from '@/comunidad/FloraLocalSection';
import AgriculturaSection from '@/comunidad/AgriculturaSection';
import { ServiciosSection } from '@/comunidad/ServiciosSection'; // Nueva importación


export function CommunitySection() {
  return (
    <>
      
      {/* Servicios y productos de la cooperativa */}
      <CooperativaSection />

      {/* Servicios generales */}
      <ServiciosSection /> {/* Nuevo componente agregado */}

      {/* Flora local y biodiversidad */}
      <FloraLocalSection />

      {/* Agricultura y producción local */}
      <AgriculturaSection />

      
    </>
  );
}
