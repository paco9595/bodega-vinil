# 📝 Vinyl Collection App - Roadmap & Improvements

Este documento lista las mejoras sugeridas y nuevas funcionalidades para llevar la aplicación al siguiente nivel.

## 🚀 Mejoras (Improvements)

### 🎨 UI/UX & Diseño

- [x] **Notificaciones Toast**: Implementar notificaciones tipo "toast" (ej. `sonner` o `react-hot-toast`) para confirmar acciones (añadido a colección, error de red, etc.) en lugar de `console.log` o alertas nativas.
- [x] **Estados de Carga (Skeletons)**: Reemplazar el texto "Loading..." por *Skeleton Loaders* animados que imiten la estructura de las tarjetas de discos para una experiencia más fluida.
- [x] **Navegación Móvil**: Mejorar el `Header` para incluir un menú hamburguesa o navegación inferior en dispositivos móviles.
- [x] **Empty States**: Diseñar vistas atractivas para cuando no hay resultados de búsqueda, wishlist vacía o colección vacía, invitando al usuario a la acción.
- [x] **Animaciones**: Añadir micro-interacciones (framer-motion) al añadir items, transiciones de página y hovers en las carátulas.

### ⚡ Performance & Técnica

- [x] **Optimización de Imágenes**: Asegurar el uso de `next/image` para las carátulas de Discogs, configurando correctamente los `remotePatterns` en `next.config.ts`.
- [x] **Debounce en Búsqueda**: Implementar *debounce* (retraso) en el input de búsqueda para evitar llamadas excesivas a la API de Discogs mientras el usuario escribe.
- [x] **Manejo de Errores Global**: Crear `error.tsx` en las rutas principales para manejar fallos de red o de API de forma elegante.
- [x] **Validación de Tipos**: Añadir validación en tiempo de ejecución (ej. Zod) para las respuestas de la API de Discogs y asegurar que los datos coincidan con las interfaces de TypeScript.

## ✨ Nuevas Funcionalidades (New Features)

### 🎧 Gestión de Colección Avanzada

- [ ] **Escaneo de Código de Barras**: Función para escanear el código de barras de un vinilo con la cámara del móvil y encontrarlo automáticamente en Discogs.
- [ ] **Notas y Calificación Privada**: Permitir al usuario añadir notas privadas ("Comprado en Londres", "Regalo de X") y calificación personal a sus discos.
- [x] **Estadísticas de Colección**: Página de "Insights" con gráficos:
  - Distribución por Géneros.
  - Artistas más coleccionados.
  - Valor estimado de la colección (min/med/max de Discogs).
- [x] **Selector Aleatorio ("Spin a Record")**: Botón para sugerir un disco de la colección aleatoriamente para escuchar.

### 🌍 Social & Integraciones

- [ ] **Integración con Spotify**: Añadir reproductor o enlace para escuchar el álbum en Spotify directamente desde la vista de detalle.
- [ ] **Perfil Público**: Opción para hacer pública la colección y compartir un enlace único con amigos.
- [x] **Exportación de Datos**: Permitir exportar la colección a CSV o JSON.

### 🔍 Descubrimiento

- [ ] **Recomendaciones**: Sugerir discos basados en lo que ya está en la colección ("Si te gusta X, te gustará Y").
- [ ] **Novedades**: Sección de "Próximos lanzamientos" o "Trending" en vinilo.

### 🗄️ Organización Físico y Mantenimiento

- [ ] **Gestión de Ubicación (Storage Mapping)**: Asignar una ubicación física (ej. "Estantería A", "Caja 3") para colecciones grandes.
- [ ] **Sistema de Calificación (Goldmine Grading)**: Registo del estado exacto del disco (Mint, VG+, G) y estado de la funda.
- [ ] **Registro de Limpieza**: Log para registrar el mantenimiento (último lavado, cambio de fundas antiestáticas).
- [ ] **Gestión de Préstamos**: Módulo para registrar discos prestados con fechas y nombres.

### 💸 Mercado, Valor y Wishlist Avanzada

- [ ] **Alertas de Precio (Price Tracker)**: Notificaciones si un vinilo de la Wishlist baja de precio en el marketplace.
- [ ] **ROI de la Colección**: Evolución de gráfica "Precio de compra" vs "Valor de mercado en Discogs".

### 🎮 Gamificación y Experiencia Premium (UI/UX)

- [x] **Vista "Crate Digging"**: Interfaz táctil inmersiva (*cover flow*) imitando rebuscar en cajones de discos.
- [ ] **Logros e Insignias (Badges)**: Medallas por hitos logrados (ej. "Cien Club", "Completista", "First Press Hunter").
- [ ] **Metas de Colección (Goals)**: Ej. "Conseguir toda la discografía de X artista" con barra de progreso.

### 🎧 Hábitos de Escucha (Social & Tracking)

- [ ] **"Now Spinning" / Play History**: Botón para registrar escuchas y generar estadísticas ("Spotify Wrapped" analógico).
- [ ] **Cajas Curadas / Sesiones**: Agrupaciones (ej. "Tarde de Lluvia", "Audiophile Testing") para planear sesiones de escucha.
