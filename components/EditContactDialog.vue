<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title class="my-2">
          <span>Editar Contato</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" class="text-center">
                <v-avatar size="100">
                  <v-img
                    :src="contact.contactImageUrl!"
                    lazy-src="../assets/images/placeholder.png"
                    height="120px"
                  ></v-img>
                </v-avatar>
              </v-col>
              <v-col cols="12" class="text-center">
                <h2>{{ contact.pessoa.nome }}</h2>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  variant="outlined"
                  v-model="contact.email"
                  label="Email"
                  :rules="[rules.required, rules.email]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :rules="[rules.required, rules.telefone]"
                  variant="outlined"
                  v-model="contact.telefone"
                  label="Telefone"
                  v-mask="'(##) #####-####'"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  :rules="[rules.required]"
                  variant="outlined"
                  v-model="contact.tag"
                  label="Tag"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :rules="[rules.required]"
                  variant="outlined"
                  v-model="contact.tipoContato"
                  :items="['EMAIL', 'TELEFONE']"
                  label="Tipo de Contato"
                  required
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-file-input
                  variant="outlined"
                  append-inner-icon="mdi-paperclip-plus"
                  prepend-icon=""
                  v-model="contactImage"
                  label="Foto"
                  accept="image/*"
                  @change="uploadImage"
                ></v-file-input>
              </v-col>
              <v-col cols="6">
                <v-checkbox v-model="contact.privado" label="Privado"></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveContact">Salvar</v-btn>
          <v-btn @click="isActive.value = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { ContatoComImagem } from "@/assets/types/user";
const props = defineProps<{
  contact: ContatoComImagem;
}>();

const { loadAuthInfo, token } = useAuth();
if (typeof window !== "undefined") {
  loadAuthInfo();
}
const { uploadPhoto } = usePhotoService(token.value);
const emit = defineEmits(["update:dialog", "save:contact"]);
const contact = ref<ContatoComImagem>({} as ContatoComImagem);
const dialog = ref<boolean>(false);
const contactImage = ref<File | null>(null);
const rules = {
  required: (value: string) => !!value || "Campo obrigatório",
  email: (value: string) => /.+@.+\..+/.test(value) || "E-mail inválido",
  telefone: (value: string) =>
    /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value) || "Telefone inválido",
  integer: (value: string) => Number.isInteger(Number(value)) || "Número inválido",
};

const saveContact = () => {
  emit("save:contact", contact.value);
  emit("update:dialog", false);
};

const uploadImage = async () => {
  if (contactImage.value && contact.value.id) {
    const formData = new FormData();
    formData.append("foto", contactImage.value);

    try {
      const uploadResponse = await uploadPhoto(contact.value.id, formData);

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error("Erro no upload da foto:", errorData);
        throw new Error("Erro no upload da foto");
      }

      contact.value.contactImageUrl = URL.createObjectURL(contactImage.value);
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
    }
  }
};

const populateModal = (prop: ContatoComImagem) => {
  contact.value = prop;
};

onUpdated(() => {
  populateModal(props.contact);
});
</script>
