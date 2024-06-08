<template>
  <v-app-bar app color="info" dark density="compact">
    <v-app-bar-nav-icon
      @click="drawer = !drawer"
      class="d-md-none"
      :style="{ color: 'white' }"
    ></v-app-bar-nav-icon>
    <v-toolbar-title :style="{ color: 'white' }">Agenda Pessoal</v-toolbar-title>
    <v-spacer></v-spacer>
    <div class="d-none d-md-flex">
      <v-tooltip bottom v-for="item in filteredMenuItems" :key="item.title">
        <template v-slot:activator="{ props }">
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            class="v-btn v-btn--icon"
            v-bind="props"
            :style="{ color: 'white', marginLeft: '1.2rem' }"
          >
            <v-icon>{{ item.icon }}</v-icon>
          </NuxtLink>
          <v-btn
            v-else
            icon
            @click="handleAction(item)"
            v-bind="props"
            :style="{ color: 'white' }"
          >
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ item.title }}</span>
      </v-tooltip>
    </div>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    class="d-md-none"
    :style="{ width: '72px' }"
  >
    <v-list dense>
      <v-tooltip bottom v-for="item in filteredMenuItems" :key="item.title">
        <template v-slot:activator="{ props }">
          <v-list-item
            @click="handleAction(item)"
            v-bind="props"
            :style="{ justifyContent: 'center' }"
          >
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item>
        </template>
        <span>{{ item.title }}</span>
      </v-tooltip>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from "nuxt/app";
import { useTheme } from "vuetify";

const drawer = ref(false);
const theme = useTheme();
const router = useRouter();
const isDarkTheme = computed(() => theme.global.current.value.dark);

const menuItems = [
  { title: "Home", icon: "mdi-home", to: "/dashboard" },
  { title: "Meu Cadastro", icon: "mdi-account", to: "/meu-cadastro" },
  { title: "Pessoas", icon: "mdi-account-group", to: "/pessoas" },
  { title: "Contatos", icon: "mdi-book", to: "/" },
  { title: "Usuários", icon: "mdi-account-multiple", to: "/usuarios", adminOnly: true },
  { title: "Alterar Tema", icon: "mdi-brightness-4", action: "toggleTheme" },
  { title: "Logout", icon: "mdi-logout", action: "logout" },
];

const isAdmin = computed(() => {
  const userRole =
    typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  return userRole === "ROLE_ADMIN";
});

function toggleTheme() {
  theme.global.name.value = isDarkTheme.value
    ? "myCustomLightTheme"
    : "myCustomDarkTheme";
}

function handleAction(item: MenuItem): void {
  if (item.to) {
    router.push(item.to);
  } else if (item.action) {
    if (item.action === "toggleTheme") {
      toggleTheme();
    } else if (item.action === "logout") {
      logout();
    }
  }
  drawer.value = false;
}

function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  }
}

const filteredMenuItems = computed(() => {
  return menuItems.filter((item) => !item.adminOnly || isAdmin.value);
});

interface MenuItem {
  title: string;
  icon: string;
  to?: string;
  action?: string;
  adminOnly?: boolean;
}
</script>
