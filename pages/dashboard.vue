<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="ma-2">
        <h2>Favoritos</h2>
        <v-row>
          <FavoriteCard
            v-for="contact in favoriteContacts"
            :key="contact.id"
            :contact="contact"
            @click="openEditDialog(contact)"
          />
        </v-row>
      </v-col>
      <v-divider class="my-4"></v-divider>
    </v-row>
    <v-row>
      <v-col cols="6" lg="10">
        <v-text-field
          v-model="search"
          label="Pesquisar Contatos"
          @input="searchContact"
          variant="outlined"
          clearable
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn
          size="large"
          class="d-block mx-auto"
          @click="openNewContactDialog"
          color="primary"
          rounded="xl"
          icon
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
      <v-col>
        <v-btn size="large" @click="fetchContacts" color="secondary" rounded="xl" icon>
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ContactTable
          :contacts="contacts"
          @edit="openEditDialog"
          @favoriteUpdated="handleFavoriteUpdated"
        />
      </v-col>
    </v-row>
  </v-container>
  <EditContactDialog
    v-model="dialog"
    :contact="currentContact"
    @edit="openEditDialog(currentContact)"
    @save:contact="saveContact(currentContact)"
  />
  <NewContactDialog
    v-model="newContactDialog"
    @success="showSnackbar('Contato Criado com Sucesso!', 'success')"
    @error="showSnackbar('Erro ao Criar o Contato.', 'error')"
  />
  <v-snackbar v-model="snackbarVisible" :color="snackbarColor" location="top">
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script lang="ts" setup>
import type { Contato, ContatoComImagem, Pessoa, Usuario } from "@/assets/types/user";
import { usePhotoService } from "@/composables/usePhotoService";

const apiUrl = "https://demometaway.vps-kinghost.net:8485";
const search = ref<string>("");
const { loadAuthInfo, token, userId } = useAuth();

const contacts = ref<ContatoComImagem[]>([]);
const favoriteContacts = ref<ContatoComImagem[]>([]);
const dialog = ref<boolean>(false);
const newContactDialog = ref<boolean>(false);
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
const snackbarVisible = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");

const showSnackbar = (message: string, type: "success" | "error" = "success") => {
  dialog.value = false;
  newContactDialog.value = false;
  snackbarMessage.value = message;
  snackbarColor.value = type === "success" ? "green" : "red";
  snackbarVisible.value = true;
  setTimeout(() => {
    snackbarVisible.value = false;
  }, 3000);
};

const openEditDialog = (contact: ContatoComImagem) => {
  currentContact.value = contact;
  dialog.value = true;
};

const openNewContactDialog = () => {
  newContactDialog.value = true;
};

const fetchContacts = async () => {
  if (!token.value || !userId.value) {
    return;
  }

  const response = await fetch(`${apiUrl}/api/contato/listar/${userId.value}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!response.ok) {
    showSnackbar("Erro ao buscar contatos", "error");
    throw new Error("Erro ao buscar contatos");
  }

  const data = await response.json();
  const { getPhoto } = usePhotoService(token.value);

  const contactsWithImages = await Promise.all(
    data.map(async (contact: ContatoComImagem) => {
      const imageUrl = await getPhoto(contact.id ?? 1);
      contact.contactImageUrl =
        imageUrl !== null ? imageUrl : "../assets/images/placeholder.png";
      return contact;
    })
  );

  contacts.value = contactsWithImages;
  showSnackbar("Contatos atualizados com sucesso");
  favoriteContacts.value = contactsWithImages.slice(0, 6);
};

const saveContact = async (contact: Contato) => {
  console.log("entrou na função de salvar", contact);
  if (!token.value || !userId.value) {
    return;
  }

  const response = await fetch(`${apiUrl}/api/contato/salvar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...contact,
      usuario: { id: userId.value },
    }),
  });

  if (!response.ok) {
    showSnackbar("Erro ao salvar contato", "error");
    throw new Error("Erro ao salvar contato");
  }

  dialog.value = false;
  showSnackbar("Contato salvo com sucesso");
  fetchContacts();
};

const searchContact = async () => {
  if (!token.value || !userId.value) {
    return;
  }

  const response = await fetch(`${apiUrl}/api/contato/pesquisar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      termo: search.value,
    }),
  });

  if (!response.ok) {
    showSnackbar("Erro ao buscar contatos", "error");
    throw new Error("Erro ao buscar contatos");
  }

  const data = await response.json();
  const { getPhoto } = usePhotoService(token.value);

  const contactsWithImages = await Promise.all(
    data.map(async (contact: ContatoComImagem) => {
      const imageUrl = await getPhoto(contact.id ?? 1);
      contact.contactImageUrl =
        imageUrl !== null ? imageUrl : "../assets/images/placeholder.png";
      return contact;
    })
  );

  contacts.value = contactsWithImages;
  showSnackbar("Pesquisa realizada com sucesso");
};

const handleFavoriteUpdated = (isFavorite: boolean) => {
  showSnackbar(
    `Contato ${isFavorite ? "favoritado" : "desfavoritado"} com sucesso`,
    "success"
  );
  fetchContacts();
};

onMounted(fetchContacts);
if (typeof window !== "undefined") {
  loadAuthInfo();
}
</script>
