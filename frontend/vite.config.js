import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    preview: {
        allowedHosts: [
            'smurfing-hunter-frontend-grav-1.onrender.com',
            'smurfing-hunter-frontend-grav.onrender.com'
        ]
    }
})
