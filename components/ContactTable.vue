<template>
  <v-skeleton-loader type="table-tbody" :loading="loading" :height="350">
    <v-data-table
      :mobile="null"
      :headers="headers"
      :items="contacts"
      mobile-breakpoint="sm"
      item-value="id"
      class="elevation-1"
      density="compact"
      hover
      :hide-default-header="isMobile"
      :items-per-page="-1"
    >
      <template #item.contactImageUrl="{ item }">
        <v-avatar size="80" class="mx-auto my-2">
          <v-img
            :src="item.contactImageUrl!"
            height="80px"
            lazy-src="../assets/images/placeholder.png"
          ></v-img>
        </v-avatar>
      </template>
      <template #item.privado="{ item }">
        <v-tooltip bottom>
          <template #activator="{ props }">
            <v-icon v-bind="props">{{
              item.privado ? "mdi-account-lock" : "mdi-lock-open-variant"
            }}</v-icon>
          </template>
          <span>{{ item.privado ? "Privado" : "Público" }}</span>
        </v-tooltip>
      </template>
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
        <v-btn
          variant="flat"
          icon
          size="small"
          class="mx-1"
          @click="toggleFavorite(item)"
        >
          <v-icon>{{ item.isFavorite ? "mdi-star" : "mdi-star-outline" }}</v-icon>
        </v-btn>
        <EditContactDialog
          @save="saveContact"
          v-model="dialog2"
          :contact="currentContact"
        />
      </template>
      <template #no-data>
        <v-alert :value="true" color="warning" icon="mdi-alert">
          Nenhum contato encontrado
        </v-alert>
      </template>
      <template #bottom />
    </v-data-table>
  </v-skeleton-loader>
  <v-dialog v-model="dialogDelete" max-width="290">
    <v-card>
      <v-card-title class="headline">Deletar contato</v-card-title>
      <v-card-text> Tem certeza que deseja deletar o contato? </v-card-text>
      <v-card-actions>
        <v-btn color="error" variant="text" @click="deleteContact(currentContact.id!)">
          Deletar
        </v-btn>
        <v-btn variant="text" @click="dialogDelete = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Contato, ContatoComImagem, Pessoa, Usuario } from "@/assets/types/user";
import { usePhotoService } from "@/composables/usePhotoService";

const props = defineProps<{
  contacts: ContatoComImagem[];
}>();

const emit = defineEmits(["edit", "delete", "favoriteUpdated"]);
const loading = ref<boolean>(true);
const apiUrl = "https://demometaway.vps-kinghost.net:8485";

const { loadAuthInfo, token } = useAuth();
const { getPhoto } = usePhotoService(token.value);

const dialog2 = ref<boolean>(false);
const contactImageUrl = ref<string | null>(null);
const dialogDelete = ref<boolean>(false);
const isMobile = ref(false);
const currentContact = ref<ContatoComImagem>({
  pessoa: {} as Pessoa,
  tag: "",
  email: "",
  telefone: "",
  tipoContato: "",
  privado: false,
  usuario: {} as Usuario,
  contactImageUrl: "",
});
const headers = [
  { title: "Foto", value: "contactImageUrl" },
  { title: "Nome", value: "pessoa.nome" },
  { title: "Email", value: "email" },
  { title: "Telefone", value: "telefone" },
  { title: "Tag", value: "tag" },
  { title: "Tipo", value: "tipoContato" },
  { title: "Privado", value: "privado" },
  { title: "Ações", value: "actions", sortable: false },
];

const fetchContactImages = async () => {
  for (const contact of props.contacts) {
    contactImageUrl.value = await getPhoto(contact.id ?? 1);
  }
  loading.value = false;
};

const openEditDialog = (item: ContatoComImagem) => {
  currentContact.value = item;
  emit("edit", currentContact.value);
};

const openDeleteDialog = (item: ContatoComImagem) => {
  currentContact.value = item;
  dialogDelete.value = true;
};

const deleteContact = async (id: number) => {
  const response = await fetch(`${apiUrl}/api/contato/remover/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!response.ok) {
    dialogDelete.value = false;
    throw new Error("Erro ao deletar contato");
  }
  dialogDelete.value = false;
};

const saveContact = async (contact: Contato) => {
  const emit = defineEmits(["save:contact"]);
  emit("save:contact", contact);
};

const toggleFavorite = async (item: ContatoComImagem) => {
  const isFavorite = !item.isFavorite;
  item.isFavorite = isFavorite;

  const url = isFavorite
    ? `${apiUrl}/api/favorito/salvar`
    : `${apiUrl}/api/favorito/remover/${item.id}`;
  const method = isFavorite ? "POST" : "DELETE";

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    body: isFavorite ? JSON.stringify({ id: item.id }) : null,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Erro ao favoritar contato:", errorData);
    throw new Error("Erro ao favoritar contato");
  }

  emit("favoriteUpdated", isFavorite);
};

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 600;
};

onMounted(() => {
  fetchContactImages();
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
