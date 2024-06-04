<template>
  <v-dialog :model-value="dialog" @update:model-value="updateDialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span>{{ isEditMode ? 'Editar Contato' : 'Adicionar Contato' }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="updateDialog(false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-avatar size="100">
                <v-img :src="contactImageUrl!" height="100px"></v-img>
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
        <v-btn @click="updateDialog(false)">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Contato } from '@/assets/types/user'

const props = defineProps<{
  dialog: boolean,
  isEditMode: boolean,
  contact: Contato
}>()

const emit = defineEmits(['update:dialog', 'save'])
const contact = ref({ ...props.contact })

const contactImageUrl = ref<string | null>(null)

const token = localStorage.getItem('token') || ''
const { getPhoto } = usePhotoService(token)

onMounted(async () => {
  contactImageUrl.value = await getPhoto(String(contact.value.id))
})

watch(() => props.dialog, (newVal) => {
  if (newVal) {
    contact.value = { ...props.contact }
    onMounted(async () => {
      contactImageUrl.value = await getPhoto(contact.value.pessoa.foto.id)
    })
  }
})

const saveContact = () => {
  emit('save', contact.value)
  emit('update:dialog', false)
}

const updateDialog = (value: boolean) => {
  emit('update:dialog', value)
}

</script>
