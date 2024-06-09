<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="headline">Editar Pessoa</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="save">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="pessoa.nome"
                :rules="[rules.required]"
                label="Nome"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="pessoa.cpf"
                v-mask="'###.###.###-##'"
                :rules="[rules.required, rules.cpf]"
                label="CPF"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="pessoa.endereco.logradouro"
                :rules="[rules.required]"
                label="Logradouro"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="pessoa.endereco.numero"
                :rules="[rules.required, rules.integer]"
                label="Número"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="pessoa.endereco.cep"
                v-mask="'#####-###'"
                :rules="[rules.required, rules.cep]"
                label="CEP"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="pessoa.endereco.bairro"
                :rules="[rules.required]"
                label="Bairro"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="pessoa.endereco.cidade"
                :rules="[rules.required]"
                label="Cidade"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="pessoa.endereco.estado"
                v-mask="'AA'"
                :rules="[rules.required]"
                label="Estado"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="pessoa.endereco.pais"
                :rules="[rules.required]"
                label="País"
                required
              ></v-text-field>
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
import type { Pessoa } from "@/assets/types/user";

const props = defineProps<{
  pessoa: Pessoa;
}>();

const emit = defineEmits(["save"]);
const dialog = ref(false);
const valid = ref(false);
const loading = ref(false);

const rules = {
  required: (value: string) => !!value || "Campo obrigatório",
  cpf: (value: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value) || "CPF inválido",
  cep: (value: string) => /^\d{5}-\d{3}$/.test(value) || "CEP inválido",
  integer: (value: string) => Number.isInteger(Number(value)) || "Número inválido",
};

const save = () => {
  if (!valid.value) return;
  loading.value = true;
  emit("save", props.pessoa);
  dialog.value = false;
  loading.value = false;
};

watch(
  () => props.pessoa,
  () => {
    dialog.value = true;
  }
);
</script>
