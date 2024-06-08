import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { mdi } from 'vuetify/iconsets/mdi'

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#fcfcfc',
    surface: '#FFFFFF',
    primary: '#315098',
    'primary-darken-1': '#203565',
    secondary: '#676773',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

const myCustomDarkTheme = {
  dark: true,
  colors: {
    background: '#191716',
    surface: '#161413',
    primary: '#E6AF2E',
    secondary: '#676773',
    'secondary-darken-1': '#03DAC6',
    error: '#922626',
    info: '#242C43',
    success: '#8ECD8F',
    warning: '#FB8C00',
  }
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'myCustomDarkTheme',
      themes: {
        myCustomLightTheme,
        myCustomDarkTheme,
      },
    },
    icons: {
      defaultSet: 'mdi',
      sets: {
        mdi,
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
