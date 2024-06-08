<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>Criar Novo Contato</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveContact">
            <v-row>
              <v-col cols="12" sm="4">
                <v-text-field
                  variant="outlined"
                  v-model="contact.email"
                  label="Email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  variant="outlined"
                  v-model="contact.telefone"
                  label="Telefone"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  variant="outlined"
                  v-model="contact.pessoa.nome"
                  label="Nome"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  variant="outlined"
                  v-model="contact.pessoa.cpf"
                  label="CPF"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  variant="outlined"
                  v-model="contact.pessoa.endereco.logradouro"
                  label="Logradouro"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  variant="outlined"
                  v-model="contact.pessoa.endereco.numero"
                  label="Número"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  variant="outlined"
                  v-model="contact.pessoa.endereco.bairro"
                  label="Bairro"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  variant="outlined"
                  v-model="contact.pessoa.endereco.cep"
                  label="CEP"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  variant="outlined"
                  v-model="contact.pessoa.endereco.cidade"
                  label="Cidade"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  variant="outlined"
                  v-model="contact.pessoa.endereco.estado"
                  label="Estado"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  variant="outlined"
                  v-model="contact.pessoa.endereco.pais"
                  label="País"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  variant="outlined"
                  v-model="contact.tag"
                  label="Tag"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  variant="outlined"
                  v-model="contact.tipoContato"
                  :items="['EMAIL', 'TELEFONE']"
                  label="Tipo de Contato"
                  required
                ></v-select>
              </v-col>
              <v-col>
                <v-checkbox v-model="contact.privado" label="Privado"></v-checkbox>
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-col cols="auto">
                <v-btn type="submit" color="primary" :loading="loading">Salvar</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useAuth } from "@/composables/useAuth";

const dialog = ref(false);
const contact = ref({
  email: "",
  pessoa: {
    cpf: "",
    endereco: {
      bairro: "",
      cep: "",
      cidade: "",
      estado: "",
      logradouro: "",
      numero: 0,
      pais: "",
    },
    nome: "",
  },
  privado: false,
  tag: "",
  telefone: "",
  tipoContato: "",
  usuario: {
    cpf: "",
    dataNascimento: "",
    email: "",
    id: 0,
    nome: "",
    password: "",
    telefone: "",
    username: "",
  },
});
const contactImage = ref(null);
const loading = ref(false);

const { loadAuthInfo, token, userId } = useAuth();
if (typeof window !== "undefined") {
  loadAuthInfo();
}

const fetchUserInfo = async () => {
  const response = await fetch(
    `https://demometaway.vps-kinghost.net:8485/api/usuario/buscar/${userId.value}`,
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar informações do usuário");
  }

  const userInfo = await response.json();
  contact.value.usuario = userInfo;
};

const saveContact = async () => {
  loading.value = true;
  try {
    await fetchUserInfo();

    const pessoaResponse = await fetch(
      "https://demometaway.vps-kinghost.net:8485/api/pessoa/salvar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(contact.value.pessoa),
      }
    );

    if (!pessoaResponse.ok) {
      throw new Error("Erro ao salvar pessoa");
    }

    const savedPessoa = await pessoaResponse.json();
    contact.value.pessoa = savedPessoa.object;

    const contatoResponse = await fetch(
      "https://demometaway.vps-kinghost.net:8485/api/contato/salvar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(contact.value),
      }
    );

    if (!contatoResponse.ok) {
      throw new Error("Erro ao salvar contato");
    }

    const savedContact = await contatoResponse.json();

    // Upload da foto
    if (contactImage.value) {
      const formData = new FormData();
      formData.append("file", contactImage.value);

      const uploadResponse = await fetch(
        `https://demometaway.vps-kinghost.net:8485/api/foto/upload/${savedContact.object.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error("Erro no upload da foto:", errorData);
        throw new Error("Erro no upload da foto");
      }
    }
  } catch (error) {
    console.error(error);
    dialog.value = false;
  } finally {
    loading.value = false;
  }
};
</script>
