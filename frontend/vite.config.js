import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/faq': {
        target: 'https://gpt-4o-chatbot.onrender.com/', // Your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/faq/, '/faq'), // Forward /faq requests to /faq on the backend
      },
      '/lead': {
        target: 'https://gpt-4o-chatbot.onrender.com/', // Your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lead/, '/lead'), // Forward /lead requests to /lead on the backend
      },
      '/upload-image': {
        target: 'https://gpt-4o-chatbot.onrender.com/', // Your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload-image/, '/upload-image'), // Forward /upload-image requests to /upload-image on the backend
      },
      '/welcome': {
        target: 'https://gpt-4o-chatbot.onrender.com/', // Your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/welcome/, '/welcome'), // Forward /welcome requests to /welcome on the backend
      },
      '/service_options': {
        target: 'https://gpt-4o-chatbot.onrender.com/', // Your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/service_options/, '/service_options'), // Forward /service_options requests to /service_options on the backend
      },
    },
  },
});
