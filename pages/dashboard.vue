<template>
  <v-container>
    <v-row>
      <v-col cols="12">
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
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          label="Pesquisar Contatos"
          @input="fetchContacts"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ContactTable 
          :contacts="contacts"
          @edit="openEditDialog"
          @delete="deleteContact"
        />
      </v-col>
    </v-row>

    <EditContactDialog
      :dialog="dialog"
      :isEditMode="editMode"
      :contact="currentContact"
      @update:dialog="dialog = $event"
      @save="saveContact"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import EditContactDialog from '@/components/EditContactDialog.vue'
import FavoriteCard from '@/components/FavoriteCard.vue'
import ContactTable from '@/components/ContactTable.vue'
import type { Contato } from '@/assets/types/user'
import { usePhotoService } from '@/composables/usePhotoService'

const apiUrl = 'https://demometaway.vps-kinghost.net:8485'

const search = ref<string>('')
const contacts = ref<Contato[]>([])
const favoriteContacts = ref<Contato[]>([])
const dialog = ref<boolean>(false)
const editMode = ref<boolean>(false)
const currentContact = ref<Contato>({
  pessoa: { id: 0, nome: '', cpf: '', endereco: { id: 0, logradouro: '', numero: 0, cep: '', bairro: '', cidade: '', estado: '', pais: '' }, foto: { id: '', name: '', type: '' } },
  tag: '',
  email: '',
  telefone: '',
  tipoContato: '',
  privado: false,
  usuario: { id: 0, nome: '', dataNascimento: '', cpf: '', email: '', telefone: '', username: '', password: '' },
})

const token = localStorage.getItem('token') || ''
const { getPhoto } = usePhotoService(token)
const contactImageUrl = ref<string | null>(null)

const fetchContacts = async () => {
  const userId = localStorage.getItem('userId')
  const response = await fetch(`${apiUrl}/api/contato/listar/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = await response.json()
  contacts.value = await Promise.all(data.map(async (contact: Contato) => {
  if (contact.id !== undefined) {
    contactImageUrl.value = await getPhoto(contact.id.toString())
  }
    return contact
  }))
  favoriteContacts.value = contacts.value.slice(0, 6) // Mostra apenas os primeiros 6 contatos como favoritos
}

const openEditDialog = (contact: Contato) => {
  editMode.value = true
  currentContact.value = { ...contact }
  dialog.value = true
}

const saveContact = async (contact: Contato) => {
  const method = editMode.value ? 'PUT' : 'POST'
  const url = editMode.value ? `${apiUrl}/api/contato/${contact.id}` : `${apiUrl}/api/contato`
  await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(contact),
  })
  dialog.value = false
  fetchContacts()
}

const deleteContact = async (id: number) => {
  await fetch(`${apiUrl}/api/contato/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  })
  fetchContacts()
}

onMounted(fetchContacts)
</script>
