<template>
  <v-skeleton-loader type="table-tbody" :loading="loading" :height="350">
    <v-data-table
      :mobile="null"
      :headers="headers"
      :items="users"
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
      </template>
      <template #no-data>
        <v-alert :value="true" color="warning" icon="mdi-alert">
          Nenhum usuário encontrado
        </v-alert>
      </template>
      <template #bottom />
    </v-data-table>
  </v-skeleton-loader>

  <v-dialog v-model="dialogEdit" max-width="500">
    <v-card>
      <v-card-title class="headline">Editar usuário</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="updateUser">
          <v-text-field
            v-model="currentUser.nome"
            label="Nome"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-text-field
            v-model="currentUser.email"
            label="Email"
            :rules="[rules.required, rules.email]"
            required
          ></v-text-field>
          <v-text-field
            v-model="currentUser.telefone"
            label="Telefone"
            :rules="[rules.required, rules.telefone]"
            v-mask="'(##) #####-####'"
            required
          ></v-text-field>
          <v-text-field
            v-model="currentUser.username"
            label="Username"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-text-field
            v-model="currentUser.password"
            label="Senha"
            type="password"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-card-actions>
            <v-btn color="primary" type="submit">Salvar</v-btn>
            <v-btn @click="dialogEdit = false">Cancelar</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Usuario } from "@/assets/types/user";
import { useAuth } from "@/composables/useAuth";

const props = defineProps<{
  users: Usuario[];
}>();

const emit = defineEmits(["edit", "delete"]);
const users = ref<Usuario[]>([]);
const loading = ref<boolean>(true);
const dialogDelete = ref<boolean>(false);
const dialogEdit = ref<boolean>(false);
const valid = ref<boolean>(false);
const isMobile = ref(false);
const currentUser = ref<Usuario>({} as Usuario);
const apiUrl = "https://demometaway.vps-kinghost.net:8485";
const { loadAuthInfo, token } = useAuth();

const headers = [
  { title: "Nome", value: "nome" },
  { title: "Email", value: "email" },
  { title: "Telefone", value: "telefone" },
  { title: "Username", value: "username" },
  { title: "Ações", value: "actions", sortable: false },
];

const rules = {
  required: (value: string) => !!value || "Campo obrigatório",
  email: (value: string) => /.+@.+\..+/.test(value) || "E-mail inválido",
  telefone: (value: string) =>
    /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value) || "Telefone inválido",
};

const openEditDialog = (item: Usuario) => {
  currentUser.value = item;
  currentUser.value.password = "";
  dialogEdit.value = true;
};

const updateUser = async () => {
  if (!valid.value) return;

  const response = await fetch(`${apiUrl}/api/usuario/atualizar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify(currentUser.value),
  });

  if (!response.ok) {
    dialogEdit.value = false;
    emit("edit", "Erro ao atualizar usuário", "error");
    throw new Error("Erro ao atualizar usuário");
  }

  dialogEdit.value = false;
  emit("edit", "Usuário atualizado com sucesso", "success");
};

const populateUsers = (data: Usuario[]) => {
  users.value = data;
  loading.value = false;
};

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 600;
};

onUpdated(() => {
  populateUsers(props.users);
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
}
</script>
