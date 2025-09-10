# 🌐 Turismo San Juan Tahitic

Proyecto web promocional para **San Juan Tahitic**, orientado a impulsar el turismo local a través de una plataforma moderna, accesible y responsiva.  

## 📖 Descripción
Este sitio web integra contenidos culturales, turísticos y comunitarios de San Juan Tahitic. Desarrollado con tecnologías modernas, permite una navegación fluida, diseño adaptable y elementos interactivos como mapas y galerías multimedia.

## 🛠️ Tecnologías utilizadas
- **React + Vite** → Framework moderno para desarrollo rápido y modular.  
- **TypeScript** → Superset de JavaScript para mayor escalabilidad y robustez.  
- **Tailwind CSS** → Framework de estilos para diseño limpio y responsivo.  
- **Recharts / shadcn/ui / lucide-react** → Componentes y visualizaciones.  

## 📂 Estructura del proyecto
/prototipo-aceptable
/guidelines
/prototipo-aceptable
/public
/src
/components
/animations
/pages
App.tsx
main.tsx
index.css
index.html
/styles
globals.css


## 🚀 Instalación y ejecución
1. Clonar este repositorio:
   ```bash
   git clone https://github.com/usuario/turismo-san-juan-tahitic.git
cd turismo-san-juan-tahitic
npm install
npm run dev

##🌟 Funcionalidades

📌 Información turística, cultural y comunitaria.

🗺️ Mapa interactivo con puntos de interés.

🌍 Soporte multilenguaje (español / náhuatl).

📱 Diseño responsivo (mobile-first).

🔍 Optimización SEO básica.

## 📈 Futuras mejoras

Integración de un sistema de reservaciones.

Blog de experiencias de turistas y locales.

Optimización avanzada de SEO.

Integración con bases de datos dinámicas.

## 📌 Este proyecto forma parte de un trabajo de residencias profesionales y busca fomentar el turismo sustentable y la identidad cultural de San Juan Tahitic.

# React + TypeScript + Vite

Esta plantilla proporciona una configuración mínima para hacer funcionar React en Vite con HMR y algunas reglas de ESLint.

Actualmente, hay dos plugins oficiales disponibles:

@vitejs/plugin-react utiliza Babel para Fast Refresh

@vitejs/plugin-react-swc utiliza SWC para Fast Refresh

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expandiendo la configuración de ESLint

Si estás desarrollando una aplicación de producción, recomendamos actualizar la configuración para habilitar reglas de lint conscientes de los tipos:

1. Instale `typescript` y `@typescript-eslint/parser` como dependencias de desarrollo:

```bash
npm add typescript @typescript-eslint/parser --save-dev
```

2. Extienda la configuración de ESLint para habilitar las reglas de lint de TypeScript:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
También puedes instalar eslint-plugin-react-x y eslint-plugin-react-dom para reglas de lint específicas de React:

[eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
