
# Calculadora de Finanzas Personales

Este proyecto es una aplicación web para gestionar finanzas personales. Utiliza **Flask** como backend para manejar una API RESTful y **React** como frontend para una interfaz de usuario dinámica y profesional.

## Estructura del Proyecto

```
finanzas-personales-proyecto/
├── backend/                # Backend con Flask
│   ├── app.py              # API principal
│   ├── finanzas.db         # Base de datos SQLite
│   ├── requirements.txt    # Dependencias de Python
│   └── venv/               # Entorno virtual (opcional)
├── frontend/               # Frontend con React
│   ├── node_modules/       # Dependencias de Node.js
│   ├── public/             # Archivos públicos
│   ├── src/                # Código fuente de React
│   ├── package.json        # Dependencias y scripts de React
│   └── package-lock.json   # Bloqueo de versiones
└── README.md               # Este archivo
```

## Características

- **Backend (Flask):**
  - API RESTful para gestionar transacciones (ingresos y gastos).
  - Base de datos SQLite para persistencia.
  - Endpoints: `GET /transacciones`, `POST /transacciones`, `DELETE /transacciones/<id>`.

- **Frontend (React):**
  - Interfaz moderna con Bootstrap y modo oscuro.
  - Tabla ordenable y paginada para mostrar transacciones.
  - Gráfico Doughnut con porcentajes de ingresos y gastos.
  - Notificaciones con `react-toastify`.
  - Modal de confirmación para eliminaciones.

## Requisitos previos

- **Python 3.8+** (para el backend).
- **Node.js 16+ y npm** (para el frontend).
- Opcional: entorno virtual para Python (`venv`).

## Instalación y configuración

### 1. Backend
1. Navega al directorio del backend:
   ```bash
   cd backend
   ```
2. (Opcional) Crea y activa un entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```
3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Inicia el servidor Flask:
   ```bash
   python app.py
   ```
   - El backend estará disponible en `http://localhost:5000`.

### 2. Frontend
1. Navega al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias de Node.js:
   ```bash
   npm install
   ```
3. Inicia la aplicación React:
   ```bash
   npm start
   ```
   - El frontend estará disponible en `http://localhost:3000` y se conectará al backend.

## Uso

1. Asegúrate de que el backend esté corriendo (`python app.py`).
2. Abre el frontend en tu navegador (`http://localhost:3000`).
3. Agrega transacciones usando el formulario (selecciona tipo, categoría, monto y descripción).
4. Ordena la tabla haciendo clic en los encabezados.
5. Usa la paginación para navegar entre transacciones.
6. Elimina transacciones con el botón de basura (confirma en el modal).
7. Alterna entre modo claro y oscuro con el botón de sol/luna.
8. Visualiza los porcentajes de ingresos y gastos en el gráfico Doughnut.

## Dependencias

### Backend (ver `requirements.txt`)
- Flask
- Flask-SQLAlchemy
- Flask-CORS

### Frontend (ver `package.json`)
- React
- Axios
- Bootstrap
- React-Bootstrap
- React-Toastify
- React-Icons
- Chart.js
- React-Chartjs-2
- React-Paginate

## Notas
- La base de datos SQLite (`finanzas.db`) se crea automáticamente en `backend/` al iniciar el servidor por primera vez.
- Si tienes problemas de conexión entre frontend y backend, verifica que CORS esté configurado correctamente en `app.py`.

## Contribuciones
Si deseas contribuir, crea un fork del proyecto, realiza tus cambios y envía un pull request.

## Licencia
Este proyecto no tiene una licencia específica definida (uso personal o educativo).
