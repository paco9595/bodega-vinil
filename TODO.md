# 📝 Vinyl Collection App - Roadmap & Improvements

Este documento lista las mejoras sugeridas y nuevas funcionalidades para llevar la aplicación al siguiente nivel.

## 🚀 Mejoras (Improvements)

### 🎨 UI/UX & Diseño

- [ ] **Notificaciones Toast**: Implementar notificaciones tipo "toast" (ej. `sonner` o `react-hot-toast`) para confirmar acciones (añadido a colección, error de red, etc.) en lugar de `console.log` o alertas nativas.
- [ ] **Estados de Carga (Skeletons)**: Reemplazar el texto "Loading..." por *Skeleton Loaders* animados que imiten la estructura de las tarjetas de discos para una experiencia más fluida.
- [ ] **Navegación Móvil**: Mejorar el `Header` para incluir un menú hamburguesa o navegación inferior en dispositivos móviles.
- [ ] **Empty States**: Diseñar vistas atractivas para cuando no hay resultados de búsqueda, wishlist vacía o colección vacía, invitando al usuario a la acción.
- [ ] **Animaciones**: Añadir micro-interacciones (framer-motion) al añadir items, transiciones de página y hovers en las carátulas.

### ⚡ Performance & Técnica

- [ ] **Optimización de Imágenes**: Asegurar el uso de `next/image` para las carátulas de Discogs, configurando correctamente los `remotePatterns` en `next.config.ts`.
- [ ] **Debounce en Búsqueda**: Implementar *debounce* (retraso) en el input de búsqueda para evitar llamadas excesivas a la API de Discogs mientras el usuario escribe.
- [ ] **Manejo de Errores Global**: Crear `error.tsx` en las rutas principales para manejar fallos de red o de API de forma elegante.
- [ ] **Validación de Tipos**: Añadir validación en tiempo de ejecución (ej. Zod) para las respuestas de la API de Discogs y asegurar que los datos coincidan con las interfaces de TypeScript.

## ✨ Nuevas Funcionalidades (New Features)

### 🎧 Gestión de Colección Avanzada

- [ ] **Escaneo de Código de Barras**: Fu
nilo con la cámara del móvil y encontralo automáticamente en Discogs.
- [ ] **Notas y Calificación Privada**: Permitir al usuario añadir notas privadas ("Comprado en Londres", "Regalo de X") y calificación personal a sus discos.
- [ ] **Estadísticas de Colección**: Página de "Insights" con gráficos:
  - Distribución por Géneros.
  - Artistas más coleccionados.
  - Valor estimado de la colección (min/med/max de Discogs).
- [ ] **Selector Aleatorio ("Spin a Record")**: Botón para sugerir un disco de la colección aleatoriamente para escuchar.

### 🌍 Social & Integraciones

- [ ] **Integración con Spotify**: Añadir reproductor o enlace para escuchar el álbum en Spotify directamente desde la vista de detalle.
- [ ] **Perfil Público**: Opción para hacer pública la colección y compartir un enlace único con amigos.
- [ ] **Exportación de Datos**: Permitir exportar la colección a CSV o JSON.

### 🔍 Descubrimiento

- [ ] **Recomendaciones**: Sugerir discos basados en lo que ya está en la colección ("Si te gusta X, te gustará Y").
- [ ] **Novedades**: Sección de "Próximos lanzamientos" o "Trending" en vinilo.
