<template>
  <v-container>
    <v-row>
      <v-col cols="6" lg="10">
        <v-text-field
          v-model="search"
          label="Pesquisar Usuários"
          @input="searchUsers"
          variant="outlined"
          clearable
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn
          size="large"
          class="d-block mx-auto"
          @click="fetchUsers"
          color="secondary"
          rounded="xl"
          icon
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <UserTable :users="users" @delete="showSnackbar" />
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbarVisible" :color="snackbarColor" location="top">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { useAuth } from "@/composables/useAuth";
import type { Usuario } from "@/assets/types/user";

const search = ref<string>("");
const snackbarVisible = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");
const users = ref<Usuario[]>([]);
const apiUrl = "https://demometaway.vps-kinghost.net:8485";
const { loadAuthInfo, token } = useAuth();

const fetchUsers = async () => {
  const response = await fetch(`${apiUrl}/api/usuario/pesquisar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify({ termo: "" }),
  });

  if (!response.ok) {
    showSnackbar("Erro ao buscar usuários", "error");
    throw new Error("Erro ao buscar usuários");
  }

  const data = await response.json();
  users.value = data;
  showSnackbar("Usuários carregados com sucesso", "success");
};

const searchUsers = async () => {
  const response = await fetch(`${apiUrl}/api/usuario/pesquisar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify({ termo: search.value }),
  });

  if (users.value.length === 0) {
    showSnackbar("Erro ao buscar usuários", "error");
    throw new Error("Erro ao buscar usuários");
  }

  const data = await response.json();
  users.value = data;
  showSnackbar("Usuários carregados com sucesso", "success");
};

const showSnackbar = (message: string, type: "success" | "error") => {
  snackbarMessage.value = message;
  snackbarColor.value = type === "success" ? "green" : "red";
  snackbarVisible.value = true;
  setTimeout(() => {
    snackbarVisible.value = false;
  }, 3000);
};

if (typeof window !== "undefined") {
  loadAuthInfo();
}

onMounted(() => {
  fetchUsers();
});
</script>
