<template>
  <v-data-table
    :headers="headers"
    :items="contacts"
    item-value="id"
    class="elevation-1"
  >
    <template #item.contactImageUrl="{ item }">
      <v-img :src="contactImageUrl!" height="80px"></v-img>
    </template>
    <template #item.actions="{ item }">
      <v-btn icon @click="openEditDialog(item)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon @click="deleteContact(item.id!)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { Contato } from '@/assets/types/user'
import { usePhotoService } from '@/composables/usePhotoService'

const props = defineProps<{
  contacts: Contato[]
}>()

const contactImageUrl = ref<string | null>(null)
const headers = [
  { text: 'Foto', value: 'contactImageUrl' },
  { text: 'Nome', value: 'pessoa.nome' },
  { text: 'Email', value: 'email' },
  { text: 'Telefone', value: 'telefone' },
  { text: 'Tag', value: 'tag' },
  { text: 'Tipo', value: 'tipoContato' },
  { text: 'Privado', value: 'privado' },
  { text: 'Ações', value: 'actions', sortable: false },
]

const token = localStorage.getItem('token') || ''
const { getPhoto } = usePhotoService(token)

const onImageError = (event: Event) => {
  console.error('Erro ao carregar imagem:', event)
}

const fetchContactImages = async () => {
  for (const contact of props.contacts) {
    contactImageUrl.value = await getPhoto(contact.pessoa.foto.id)
  }
}

onMounted(fetchContactImages)

const openEditDialog = (contact: Contato) => {
  const emit = defineEmits(['edit',])

  emit('edit', contact)
}

const deleteContact = (id: number) => {
  const emit = defineEmits(['delete'])
  emit('delete', id)
}
</script>
