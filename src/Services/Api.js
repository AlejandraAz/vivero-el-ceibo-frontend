import axios from 'axios';
console.log('[API] Inicializando servicio API');


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    withCredentials: true, // MUY IMPORTANTE para enviar cookies httpOnly
    headers: {
        // Nada de Authorization aquí; las cookies viajan solas
    }
});

// Log (solo dev)
if (import.meta.env.DEV) {
    console.log('API URL:', API_URL);
}

// Interceptor request (log + cronómetro opcional)
api.interceptors.request.use(
    (config) => {
        const startTime = performance.now();
        config.metadata = { startTime };
        console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('[API] Error en la petición:', error);
        return Promise.reject(error);
    }
);

// Interceptor respuesta con refresh automático
let isRefreshing = false;
let pendingRequests = [];

const processQueue = (error) => {
    pendingRequests.forEach((p) => (error ? p.reject(error) : p.resolve()));
    pendingRequests = [];
};

api.interceptors.response.use(
    (response) => {
        const { config } = response;
        if (config.metadata?.startTime) {
            const ms = performance.now() - config.metadata.startTime;
            console.log(`[API] ${config.url} en ${ms.toFixed(2)}ms`);
        }
        return response;
    },
    async (error) => {
        const { config, response } = error;

        if (config?.metadata?.startTime) {
            const ms = performance.now() - config.metadata.startTime;
            console.log(`[API] Error en ${config.url} tras ${ms.toFixed(2)}ms`);
            console.log(`[API] Código: ${response?.status || 'Sin respuesta'}`);
        }

        // Si es 401, intentamos refrescar y reintentar UNA vez
        if (response?.status === 401 && !config._retry) {
            if (isRefreshing) {
                // Esperar a que termine el refresh en curso y reintentar
                return new Promise((resolve, reject) => {
                    pendingRequests.push({ resolve: () => resolve(api(config)), reject });
                });
            }
            config._retry = true;
            isRefreshing = true;

            try {
                await api.post('/auth/refresh');
                processQueue(null);
                return api(config); 
            } catch (refreshErr) {
                processQueue(refreshErr);
                console.log('[API] Refresh falló → redirigir a login');
                
                window.location.href = '/login';
                return Promise.reject(refreshErr);
            } finally {
                isRefreshing = false;
            }
        }

        // 403: bloqueado o sin permiso
        if (response?.status === 403) {
            console.log('[API] 403: sin permiso o cuenta bloqueada.');
        }

        return Promise.reject(error);
    }
);

export default api;
