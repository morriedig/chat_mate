import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { resolveEdition, editionBuild, transformIndexHtml } from './editionBuild.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // VITE_EDITION from the shell or a .env file: 'en' (default) or 'zh' (docs/plans/zh-edition.md)
  const edition = resolveEdition(loadEnv(mode, process.cwd(), 'VITE_').VITE_EDITION)
  const build = editionBuild(edition, { githubPages: Boolean(process.env.GITHUB_PAGES) })

  return {
    // A fixed value, so the English build drops Chinese-only branches as dead code
    define: {
      'import.meta.env.VITE_EDITION': JSON.stringify(edition),
    },
    publicDir: build.publicDir,
    build: {
      outDir: build.outDir,
    },
    plugins: [
      vue(),
      {
        name: 'chatmate-edition-html',
        transformIndexHtml: (html) => transformIndexHtml(html, build),
      },
      VitePWA({
        registerType: 'prompt',
        devOptions: {
          enabled: false
        },
        manifest: {
          name: build.manifestName,
          short_name: build.appName,
          description: build.description,
          theme_color: '#2badee',
          background_color: '#101c22',
          display: 'standalone',
          icons: [
            {
              src: 'icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: 'icons/icon-192x192.svg',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: 'icons/icon-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }
              }
            },
            {
              urlPattern: /\.(?:mp3|wav|ogg)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'audio-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }
              }
            },
            {
              urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }
              }
            },
            {
              urlPattern: /^https:\/\/script\.google\.com\/macros\/s\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'gas-api-cache',
                networkTimeoutSeconds: 10,
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }
              }
            }
          ]
        }
      })
    ],
    // For GitHub Pages the app lives under /chat_mate/app/; /chat_mate/ is the landing page (landing/)
    // that points people to the iOS app. The Chinese app: /chat_mate/zh/app/ and landing-zh/ at
    // /chat_mate/zh/. Leave '/' for local dev.
    base: build.base,
    test: {
      globals: true,
      environment: 'happy-dom',
      exclude: ['e2e/**', 'node_modules/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*.{js,vue}'],
        exclude: ['src/main.js', 'src/data/**']
      }
    }
  }
})
