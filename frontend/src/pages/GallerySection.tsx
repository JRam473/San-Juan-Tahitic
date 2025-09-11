import { GalleryGeneralSection } from '@/galeria/GalleryGeneralSection';
import  GalleryUserSection  from '@/galeria/GalleryUserSection';
import  CommentsForumSection  from '@/galeria/CommentsForumSection';

export function GallerySection() {
  return (
    <>
      {/* Galería general */}
      <GalleryGeneralSection />

      {/* Galería para usuarios */}
      <GalleryUserSection />

      {/* Foro de comentarios */}
      <CommentsForumSection />
    </>
  );
}
