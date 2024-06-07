<template>
  <v-skeleton-loader type="avatar" :loading="loading" :height="350">
    <v-data-table
      :headers="headers"
      :items="contacts"
      item-value="id"
      class="elevation-1"
      hover
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
      <template #item.actions="{ item }">
        <v-btn icon @click="openEditDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteContact(item.id!)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <EditContactDialog
          @save="saveContact"
          v-model="dialog2"
          :contact="currentContact"
        />
      </template>
      <template #no-data>
        <v-alert :value="true" color="error" icon="mdi-alert">
          Nenhum contato encontrado
        </v-alert>
      </template>
    </v-data-table>
  </v-skeleton-loader>
</template>

<script lang="ts" setup>
import type {
  Contato,
  ContatoComImagem,
  Pessoa,
  Usuario,
} from "@/assets/types/user";
import { usePhotoService } from "@/composables/usePhotoService";

const emit = defineEmits(["edit"]);
const loading = ref<boolean>(true);

const { loadAuthInfo, token } = useAuth();

if (typeof window !== "undefined") {
  loadAuthInfo();
}
const props = defineProps<{
  contacts: ContatoComImagem[];
}>();

const dialog2 = ref<boolean>(false);
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

const contactImageUrl = ref<string | null>(null);
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

const { getPhoto } = usePhotoService(token.value);

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

const deleteContact = (id: number | undefined) => {
  const emit = defineEmits(["delete"]);
  emit("delete", id ?? 0);
};

const saveContact = async (contact: Contato) => {
  const emit = defineEmits(["save:contact"]);
  emit("save:contact", contact);
};
onMounted(fetchContactImages);
</script>
