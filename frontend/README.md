
# Frontend - Crypto Investment Tracker 💹

Este proyecto representa la interfaz de usuario de la aplicación **Crypto Investment Tracker**, desarrollada con React y Vite para visualizar en tiempo real la evolución de criptomonedas como BTC, ETH y SOL. El frontend se conecta con el backend mediante una API RESTful y proporciona visualización interactiva de datos históricos.

## 🌐 Tecnologías Utilizadas

- **React 19**
- **Vite 7**
- **TypeScript**
- **Chart.js + react-chartjs-2** para gráficos
- **React Toastify** para notificaciones
- **React Spinners** para loaders
- **ESLint** para linting de código
- **Mermaid** para documentación

## 📦 Instalación y ejecución

1. Clona el repositorio y navega al directorio del frontend:
   ```bash
   git clone <REPO_URL>
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` con la siguiente variable:
   ```env
   VITE_API_BASE_URL=BACKEND_URL_API - localhost:3001
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🧠 Arquitectura

```mermaid
graph TD
  A[Inicio] --> B[App.jsx]
  B --> C[CryptoList.jsx]
  C --> D[CryptoCard.jsx]
  D --> E[useEffect -> fetch(`/api/cryptos`)]
  C --> F[CryptoChart.jsx]
  F --> G[useEffect -> fetch(`/api/cryptos/history/:symbol`)]
  B --> H[ToastContainer]
```

## 📁 Estructura de carpetas

```
frontend/
│
├── public/                  # Archivos estáticos
├── src/
│   ├── components/          # Componentes UI reutilizables
│   ├── pages/               # Paginas
│   ├── services/            # Lógica de conexión con API
│   ├── App.jsx              # Componente raíz
│   └── main.jsx             # Punto de entrada React
├── .env                     # Variables de entorno (no versionar)
├── vite.config.js           # Configuración de Vite
└── package.json
```

## 🚀 Scripts útiles

- `npm run dev`: Inicia la app en modo desarrollo.
- `npm run build`: Genera la versión de producción.
- `npm run preview`: Previsualiza el build localmente.
- `npm run lint`: Ejecuta ESLint.

## 🧪 Testing

> Actualmente no se han implementado pruebas automáticas en el frontend, pero se recomienda considerar librerías como **Jest**, **Testing Library** y **Cypress** para pruebas unitarias, integración y E2E.

## 📜 Licencia

MIT

## 🧑‍💻 Autor

Proyecto técnico desarrollado como parte de una evaluación para una vacante en desarrollo **Fullstack (Node.js + React)**, realizado por Camilo Yaya.
