<template>
  <v-col cols="4" md="2" class="text-center">
    <v-avatar size="80" @click="$emit('click', contact)" class="mx-auto">
      <v-img :src="contactImageUrl!" height="80px" lazy-src="../assets/images/placeholder.png"></v-img>
    </v-avatar>
    <div>{{ contact.pessoa.nome }}</div>
  </v-col>
</template>

<script lang="ts" setup>
import type { ContatoComImagem } from '@/assets/types/user'
import { usePhotoService } from '@/composables/usePhotoService'

const { loadAuthInfo, token } = useAuth()
if (typeof window !== 'undefined') {
  loadAuthInfo()
}

const props = defineProps<{
  contact: ContatoComImagem
}>()

const contactImageUrl = ref<string | null>(null)

const { getPhoto } = usePhotoService(token.value)

onMounted(async () => {
  if (props.contact.id !== undefined) {
    contactImageUrl.value = await getPhoto(props.contact.id)
    if (contactImageUrl.value == null) {
      contactImageUrl.value = '../assets/images/placeholder.png'
    }
  }
})
</script>
