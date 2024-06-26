export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  modules: [
    '@nuxthub/core',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@nuxt/eslint'
  ],
  hub: {
    database: true
  },
  ui: {
    icons: ['heroicons', 'simple-icons']
  },
  // Development config
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never'
      }
    }
  },
  nitro: {
    typescript: {
      // eslint compatible
      tsConfig: { compilerOptions: { noEmit: true } }
    }
  },
  devtools: {
    enabled: true
  }
})
