<template>
  <v-card>
    <v-img :src="contactImageUrl!" height="200px"></v-img>
    <v-card-title>{{ contact.pessoa.nome }}</v-card-title>
    <v-card-subtitle>{{ contact.email }}</v-card-subtitle>
    <v-card-subtitle>{{ contact.telefone }}</v-card-subtitle>
    <v-card-text>
      <p><strong>Tag:</strong> {{ contact.tag }}</p>
      <p><strong>Tipo:</strong> {{ contact.tipoContato }}</p>
      <p><strong>Privado:</strong> {{ contact.privado ? 'Sim' : 'Não' }}</p>
    </v-card-text>
    <v-card-actions>
      <v-btn icon @click="$emit('edit', contact)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('delete', contact.id)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import type { Contato } from '@/assets/types/user'

const props = defineProps<{
  contact: Contato
}>()

const contactImageUrl = ref<string | null>(null)

const token = localStorage.getItem('token') || ''
const { getPhoto } = usePhotoService(token)

onMounted(async () => {
  if (props.contact.id !== undefined) {
    contactImageUrl.value = await getPhoto(props.contact.id.toString())
  }
})

</script>
