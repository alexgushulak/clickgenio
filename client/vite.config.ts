import { defineConfig } from 'vite';
import dns from 'dns'
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  plugins: [
    react()],
  server: {
    host: 'localhost',
    port: 3000
  },
  optimizeDeps: {
    esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
            global: 'globalThis'
        },
        // Enable esbuild polyfill plugins
        plugins: [
            NodeGlobalsPolyfillPlugin({
                buffer: true
            })
        ]
    }
}
});
