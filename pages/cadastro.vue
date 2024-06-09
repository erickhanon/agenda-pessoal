<template>
  <v-container>
    <v-card>
      <v-card-title>Atualização Meu Cadastro</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="saveUser">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                variant="outlined"
                v-model="user.nome"
                label="Nome"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                variant="outlined"
                v-model="user.email"
                label="Email"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                variant="outlined"
                v-model="user.cpf"
                label="CPF"
                v-mask="'###.###.###-##'"
                :rules="[rules.required, rules.cpf]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                variant="outlined"
                v-model="user.dataNascimento"
                label="Data Nascimento"
                type="date"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                variant="outlined"
                v-model="user.telefone"
                label="Telefone"
                v-mask="'(##) #####-####'"
                :rules="[rules.required, rules.telefone]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                variant="outlined"
                v-model="user.username"
                label="Username"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                variant="outlined"
                v-model="user.password"
                label="Senha"
                type="password"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn type="submit" color="primary" :loading="loading">Salvar</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbarVisible" :color="snackbarColor" location="top">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { useAuth } from "@/composables/useAuth";

const user = ref({
  id: 0,
  nome: "",
  email: "",
  cpf: "",
  dataNascimento: "",
  telefone: "",
  username: "",
  password: "",
});
const snackbarVisible = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");
const valid = ref(false);
const loading = ref(false);
const rules = {
  required: (value: string) => !!value || "Campo obrigatório",
  email: (value: string) => /.+@.+\..+/.test(value) || "E-mail inválido",
  telefone: (value: string) =>
    /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value) || "Telefone inválido",
  cpf: (value: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value) || "CPF inválido",
  password: (value: string) =>
    (value.length >= 8 && /\d/.test(value) && /[a-zA-Z]/.test(value)) ||
    "Senha deve ter pelo menos 8 caracteres, com letras e números",
};

const { loadAuthInfo, token, userId } = useAuth();
if (typeof window !== "undefined") {
  loadAuthInfo();
}

const fetchUserInfo = async () => {
  const response = await fetch(
    `https://demometaway.vps-kinghost.net:8485/api/usuario/buscar/${userId.value}`,
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar informações do usuário");
  }

  const userInfo = await response.json();
  if (userInfo.object && userInfo.object.usuario) {
    user.value = userInfo.object.usuario;
    user.value.password = "";
  }
};

const saveUser = async () => {
  if (!valid.value) return;

  loading.value = true;
  try {
    const response = await fetch(
      `https://demometaway.vps-kinghost.net:8485/api/usuario/atualizar`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(user.value),
      }
    );

    if (!response.ok) {
      showNotification("Erro ao salvar informações do usuário", "red");
      throw new Error("Erro ao salvar informações do usuário");
    }
    showNotification("Informações salvas com sucesso", "green");

    const savedUser = await response.json();
    if (savedUser.object) {
      user.value = savedUser.object;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const showNotification = (message: string, color: string) => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbarVisible.value = true;
};

onMounted(fetchUserInfo);
</script>
