import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"
import { VitePWA } from 'vite-plugin-pwa'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// PWA Config
// requirements: https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
const pwa = env => VitePWA( {

    // https://vite-pwa-org.netlify.app/guide/service-worker-strategies-and-behaviors.html
    registerType: 'autoUpdate',

    // https://vite-pwa-org.netlify.app/guide/service-worker-precache.html#precache-manifest
    workbox: {
        globPatterns: [ '**/*.{js,css,html,ico,png,svg,jsx,.riv}' ]
    },

    // https://vite-pwa-org.netlify.app/guide/#configuring-vite-plugin-pwa
    devOptions: {
        enabled: true,
        type: 'classic'
    },

    // Assets to include (that are not under `manifest`) https://vite-pwa-org.netlify.app/guide/static-assets.html#static-assets-handling
    // for favicon: https://realfavicongenerator.net/
    includeAssets: [ 'favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg' ],

    // PWA Manifest
    manifest: {
        name: "POAP Checkout",
        short_name: "POAP Checkout",
        description: "Buy POAPs",
        theme_color: "#7c72e2",
        icons: [
            {
                src: 'logo192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: 'logo512.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ]
    }

} )

export default defineConfig( ( { command, mode } ) => {
    return {
        build: {
            outDir: 'build'
        },
        plugins: [ react(), svgr()  ],
        server: {
            port: 3000
        },

        // Polyfill the Buffer nodejs module for the browser
        optimizeDeps: {
            esbuildOptions: {
                define: {
                    global: 'globalThis'
                },
                plugins: [ NodeGlobalsPolyfillPlugin( { buffer: true } ) ]
            }
        }
    }
} )