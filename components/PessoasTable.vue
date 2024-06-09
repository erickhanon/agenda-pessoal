<template>
  <v-skeleton-loader type="table-tbody" :loading="loading" :height="350">
    <v-data-table
      :mobile="null"
      :headers="headers"
      :items="pessoas"
      mobile-breakpoint="sm"
      item-value="id"
      class="elevation-1"
      hover
      :hide-default-header="isMobile"
      :items-per-page="-1"
    >
      <template #item.actions="{ item }">
        <v-btn
          icon
          variant="flat"
          size="small"
          class="mx-1"
          @click="openEditDialog(item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="flat"
          size="small"
          class="mx-1"
          @click="openDeleteDialog(item)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      <template #no-data>
        <v-alert :value="true" color="warning" icon="mdi-alert">
          Nenhuma pessoa encontrada
        </v-alert>
      </template>
      <template #bottom />
    </v-data-table>
  </v-skeleton-loader>
  <v-dialog v-model="dialogDelete" max-width="290">
    <v-card>
      <v-card-title class="headline">Deletar pessoa</v-card-title>
      <v-card-text> Tem certeza que deseja deletar a pessoa? </v-card-text>
      <v-card-actions>
        <v-btn color="error" variant="text" @click="deletePessoa(currentPessoa.id!)">
          Deletar
        </v-btn>
        <v-btn variant="text" @click="dialogDelete = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <EditPessoaDialog v-model="dialogEdit" :pessoa="currentPessoa" @save="savePessoa" />
</template>

<script lang="ts" setup>
import type { Pessoa } from "@/assets/types/user";
import { useAuth } from "@/composables/useAuth";

const props = defineProps<{
  pessoas: Pessoa[];
}>();

const emit = defineEmits(["edit", "delete", "save"]);
const pessoas = ref<Pessoa[]>([]);
const loading = ref<boolean>(true);
const dialogDelete = ref<boolean>(false);
const dialogEdit = ref<boolean>(false);
const isMobile = ref(false);
const currentPessoa = ref<Pessoa>({} as Pessoa);
const apiUrl = "https://demometaway.vps-kinghost.net:8485";
const { loadAuthInfo, token } = useAuth();

const headers = [
  { title: "Nome", value: "nome" },
  { title: "CPF", value: "cpf" },
  { title: "Endereço", value: "endereco.logradouro" },
  { title: "Ações", value: "actions", sortable: false },
];

const openEditDialog = (item: Pessoa) => {
  currentPessoa.value = item;
  console.log(currentPessoa.value);
  dialogEdit.value = true;
};

const populatePessoas = (data: Pessoa[]) => {
  pessoas.value = data;
  loading.value = false;
};

const openDeleteDialog = (item: Pessoa) => {
  currentPessoa.value = item;
  dialogDelete.value = true;
};

const deletePessoa = async (id: number) => {
  const response = await fetch(`${apiUrl}/api/pessoa/remover/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!response.ok) {
    dialogDelete.value = false;
    emit("delete", "Erro ao deletar pessoa", "error");
    throw new Error("Erro ao deletar pessoa");
  }
  dialogDelete.value = false;
  emit("delete", "Pessoa deletada com sucesso", "success");
  fetchPessoas();
};

const savePessoa = async (pessoa: Pessoa) => {
  if (!token.value) {
    return;
  }

  const response = await fetch(`${apiUrl}/api/pessoa/salvar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify(pessoa),
  });

  if (!response.ok) {
    emit("save", "Erro ao salvar pessoa", "error");
    throw new Error("Erro ao salvar pessoa");
  }

  emit("save", "Pessoa salva com sucesso", "success");
  dialogEdit.value = false;
  fetchPessoas();
};

const fetchPessoas = async () => {
  if (!token.value) {
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
    emit("edit", "Erro ao buscar pessoas", "error");
    throw new Error("Erro ao buscar pessoas");
  }

  const data = await response.json();
  pessoas.value = data;
  emit("edit", "Pessoas carregadas com sucesso", "success");
};

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 600;
};

onUpdated(() => {
  populatePessoas(props.pessoas);
  updateIsMobile();
  window.addEventListener("resize", updateIsMobile);
});

watchEffect(() => {
  if (typeof window !== "undefined") {
    updateIsMobile();
  }
});

if (typeof window !== "undefined") {
  loadAuthInfo();
  fetchPessoas();
}
</script>
