<template>
  <v-col cols="4" md="2" class="text-center">
    <v-avatar size="80" @click="$emit('click', contact)" class="mx-auto">
      <v-img :src="contactImageUrl!" height="80px"></v-img>
    </v-avatar>
    <div>{{ contact.pessoa.nome }}</div>
  </v-col>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted } from 'vue'
import type { Contato } from '@/assets/types/user'
import { usePhotoService } from '@/composables/usePhotoService'

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
