<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Pessoas</h2>
        <v-row>
          <v-col cols="6" lg="10">
            <v-text-field
              v-model="search"
              label="Pesquisar Pessoas"
              @input="searchPessoa"
              variant="outlined"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-btn
              size="large"
              class="d-block mx-auto"
              @click="openNewPessoaDialog"
              color="primary"
              rounded="xl"
              icon
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn size="large" @click="fetchPessoas" color="secondary" rounded="xl" icon>
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <PessoasTable :pessoas="pessoas" @edit="openEditDialog" />
      </v-col>
    </v-row>
  </v-container>
  <NewContactDialog
    v-model="newPessoaDialog"
    @success="showSnackbar('Contato Criado com Sucesso!', 'success')"
    @error="showSnackbar('Erro ao Criar o Contato.', 'error')"
  />
  <v-snackbar v-model="snackbarVisible" :color="snackbarColor" location="top">
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script lang="ts" setup>
import type { Pessoa } from "@/assets/types/user";
import { useAuth } from "@/composables/useAuth";

const apiUrl = "https://demometaway.vps-kinghost.net:8485";
const search = ref<string>("");
const { loadAuthInfo, token, userId } = useAuth();

const pessoas = ref<Pessoa[]>([]);
const dialog = ref<boolean>(false);
const newPessoaDialog = ref<boolean>(false);
const currentPessoa = ref<Pessoa>({
  id: 0,
  nome: "",
  cpf: "",
  endereco: {
    id: 0,
    logradouro: "",
    numero: 0,
    cep: "",
    bairro: "",
    cidade: "",
    estado: "",
    pais: "",
  },
  foto: undefined,
});
const snackbarVisible = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");

const showSnackbar = (message: string, type: "success" | "error" = "success") => {
  snackbarMessage.value = message;
  snackbarColor.value = type === "success" ? "green" : "red";
  snackbarVisible.value = true;
  setTimeout(() => {
    snackbarVisible.value = false;
  }, 3000);
};

const openEditDialog = (pessoa: Pessoa) => {
  currentPessoa.value = pessoa;
  dialog.value = true;
};

const openNewPessoaDialog = () => {
  newPessoaDialog.value = true;
};

const fetchPessoas = async () => {
  if (!token.value || !userId.value) {
    return;
  }

  const response = await fetch(`${apiUrl}/api/pessoa/pesquisar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome: "" }),
  });

  if (!response.ok) {
    showSnackbar("Erro ao buscar pessoas", "error");
    throw new Error("Erro ao buscar pessoas");
  }

  const data = await response.json();
  pessoas.value = data;
  showSnackbar("Pessoas atualizadas com sucesso");
};

const searchPessoa = async () => {
  if (!token.value || !userId.value) {
    return;
  }

  const response = await fetch(`${apiUrl}/api/pessoa/pesquisar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome: search.value }),
  });

  if (!response.ok) {
    showSnackbar("Erro ao buscar pessoas", "error");
    throw new Error("Erro ao buscar pessoas");
  }

  const data = await response.json();
  pessoas.value = data;
  showSnackbar("Pesquisa realizada com sucesso");
};

const deletePessoa = async (id: number) => {
  if (!token.value || !userId.value) {
    return;
  }

  const response = await fetch(`${apiUrl}/api/pessoa/remover/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!response.ok) {
    showSnackbar("Erro ao deletar pessoa", "error");
    throw new Error("Erro ao deletar pessoa");
  }

  dialog.value = false;
  showSnackbar("Pessoa deletada com sucesso");
  fetchPessoas();
};

const savePessoa = async (pessoa: Pessoa) => {
  if (!token.value || !userId.value) {
    return;
  }

  const response = await fetch(`${apiUrl}/api/pessoa/salvar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pessoa),
  });

  if (!response.ok) {
    showSnackbar("Erro ao salvar pessoa", "error");
    throw new Error("Erro ao salvar pessoa");
  }

  dialog.value = false;
  showSnackbar("Pessoa salva com sucesso");
  fetchPessoas();
};

onMounted(fetchPessoas);

if (typeof window !== "undefined") {
  loadAuthInfo();
}
</script>
