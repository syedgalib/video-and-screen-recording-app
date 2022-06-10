import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import projectConfig from './vite.project-config'

// https://vitejs.dev/config/
export default defineConfig( ( { command, mode } ) => {
  const config = projectConfig( mode );

  console.log( { command, mode } );

  return {
    plugins: [ react() ],
    build: {
      outDir: '',
      assetsDir: 'assets',
      emptyOutDir: false,
      polyfillModulePreload: false,
      sourcemap: true,
      minify: config.minify,
      rollupOptions: {
        input: {
          main: '/src/js/main.jsx',
        },
        output: {
          entryFileNames: config.entryFileNames,
          chunkFileNames: config.entryFileNames,
          assetFileNames: config.assetFileNames,
        }
      },
    },
    server: config.server,
  }
})