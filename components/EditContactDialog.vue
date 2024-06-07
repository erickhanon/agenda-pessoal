<template>
  <v-dialog max-width="600px" v-model="dialog">
  <template v-slot:default="{ isActive }">
    <v-card>
      <v-card-title>
        <span>Editar Contato</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="isActive.value = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-avatar size="100">
                <v-img :src="contact.contactImageUrl!" lazy-src="../assets/images/placeholder.png" height="120px"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="12" class="text-center">
              <h3>{{ contact.pessoa.nome }}</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="contact.email" label="Email" required></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="contact.telefone" label="Telefone" required></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="contact.tag" label="Tag" required></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="contact.tipoContato"
                :items="['EMAIL', 'TELEFONE']"
                label="Tipo de Contato"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
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
import type { ContatoComImagem } from '@/assets/types/user'

const props = defineProps<{
  contact: ContatoComImagem
}>()

const { loadAuthInfo } = useAuth()

if (typeof window !== 'undefined') {
  loadAuthInfo()
  
}
const emit = defineEmits(['update:dialog', 'save:contact'])
const contact = ref<ContatoComImagem>({} as ContatoComImagem);
const dialog = ref<boolean>(false)

const saveContact = () => {
  console.log('ENTROU NO EMIT', contact.value)
  emit('save:contact', contact.value)
  emit('update:dialog', false)
}

const updateDialog = (value: boolean) => {
  emit('update:dialog', value)
}

const populateModal = (prop: ContatoComImagem) => {
  contact.value = prop
}

onUpdated(() => {
  populateModal(props.contact)
})

</script>
