<template>
  <v-app>
    <v-container>
      <v-row v-if="!showNavbar" justify="end" align="center" style="margin-top: 0.1rem;">
        <v-col cols="auto">
          <v-btn icon @click="toggleTheme">
            <v-icon>{{ isDarkTheme ? 'mdi-brightness-4' : 'mdi-brightness-7' }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <Navbar v-if="showNavbar" />
      <v-main>
        <NuxtPage />
      </v-main>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { computed } from 'vue'
import { useRoute } from 'nuxt/app'

const route = useRoute()
const theme = useTheme()
const isDarkTheme = computed(() => theme.global.current.value.dark)

function toggleTheme() {
  theme.global.name.value = isDarkTheme.value ? 'myCustomLightTheme' : 'myCustomDarkTheme'
}
const showNavbar = computed(() => route.path !== '/')
</script>



