import  Places  from '../turismo/Places';
import { AdventureActivities } from '../turismo/AdventureActivities ';


export function TourismSection() {
  return (
    <>
      {/* Sección principal de lugares destacados */}
      <Places />

      {/* Actividades de aventura */}
      <AdventureActivities />

      
    </>
  );
}