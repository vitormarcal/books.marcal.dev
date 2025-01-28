// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@pinia/nuxt',],

  routeRules: {
    '/': { prerender: true }
  },

  css: ['~/assets/css/resets.css'],

  compatibilityDate: '2025-01-12'
})