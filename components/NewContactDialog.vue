<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-card-title>Criar Novo Contato</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                variant="outlined"
                :rules="[rules.required, rules.email]"
                v-model="contact.email"
                label="Email"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                variant="outlined"
                v-model="contact.telefone"
                :rules="[rules.required, rules.telefone]"
                v-mask="'(##) #####-####'"
                label="Telefone"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                variant="outlined"
                :rules="[rules.required]"
                v-model="contact.pessoa.nome"
                label="Nome"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                :rules="[rules.required, rules.cpf]"
                v-mask="'###.###.###-##'"
                variant="outlined"
                v-model="contact.pessoa.cpf"
                label="CPF"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                :rules="[rules.required]"
                variant="outlined"
                v-model="contact.pessoa.endereco.logradouro"
                label="Logradouro"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                :rules="[rules.required]"
                variant="outlined"
                v-model="contact.pessoa.endereco.numero"
                label="Número"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                :rules="[rules.required]"
                variant="outlined"
                v-model="contact.pessoa.endereco.bairro"
                label="Bairro"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                :rules="[rules.required, rules.cep]"
                v-mask="'#####-###'"
                variant="outlined"
                v-model="contact.pessoa.endereco.cep"
                label="CEP"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                :rules="[rules.required]"
                variant="outlined"
                v-model="contact.pessoa.endereco.cidade"
                label="Cidade"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                :rules="[rules.required]"
                v-mask="'AA'"
                variant="outlined"
                v-model="contact.pessoa.endereco.estado"
                label="Estado"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                variant="outlined"
                :rules="[rules.required]"
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
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col>
              <v-checkbox v-model="contact.privado" label="Privado" />
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
const valid = ref(false);
const loading = ref(false);
const rules = {
  required: (value: string) => !!value || "Campo obrigatório",
  email: (value: string) => /.+@.+\..+/.test(value) || "E-mail inválido",
  telefone: (value: string) =>
    /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value) || "Telefone inválido",
  cpf: (value: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value) || "CPF inválido",
  cep: (value: string) => /^\d{5}-\d{3}$/.test(value) || "CEP inválido",
  integer: (value: string) => Number.isInteger(Number(value)) || "Número inválido",
};
const { loadAuthInfo, token, userId } = useAuth();
if (typeof window !== "undefined") {
  loadAuthInfo();
}
const emit = defineEmits(["success", "error"]);

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

const submitForm = async () => {
  if (!valid.value) {
    console.log("valid vlaue", valid.value);
    return;
  }

  await saveContact();
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
    {
      if (!contatoResponse.ok) {
        throw new Error("Erro ao salvar contato");
      }

      emit("success");
      dialog.value = false;
    }
  } catch (error) {
    emit("error");
  } finally {
    loading.value = false;
  }
};
</script>
