//pages/PanelPlaceSection.tsx
import  Places  from '@/turismo/Places';
import { AdminPlaces } from '@/components/admin/AdminPlaces';


export function PanelPlaceSection() {
  return (
    <>
      {/* Galería general */}
      <Places />

      {/* Galería para usuarios */}
      <AdminPlaces />
    </>
  );
}
