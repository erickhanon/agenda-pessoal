<template>
  <v-container
    style="height: 100vh; display: flex; align-items: center; justify-content: center"
  >
    <v-row style="align-items: center; justify-content: center">
      <v-col cols="12" md="6" lg="4">
        <v-card color="surface" style="padding: 0.5em; max-width: 30em">
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                variant="outlined"
                v-model="username"
                label="Usuário"
                required
              ></v-text-field>
              <v-text-field
                variant="outlined"
                v-model="password"
                label="Senha"
                type="password"
                required
              ></v-text-field>
              <v-checkbox v-model="remember" label="Lembrar credenciais"></v-checkbox>
              <v-card-actions>
                <v-col cols="12" class="text-center">
                  <v-btn type="submit" variant="flat" class="w-100" color="primary"
                    >Entrar</v-btn
                  >
                </v-col>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const username = ref("");
const password = ref("");
const remember = ref(false);
const router = useRouter();
const { setAuthInfo } = useAuth();

const login = async () => {
  try {
    const response = await fetch(
      "https://demometaway.vps-kinghost.net:8485/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.value, password: password.value }),
      }
    );

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();
    setAuthInfo({
      id: data.id,
      username: data.username,
      tipos: data.tipos,
      accessToken: data.accessToken,
      tokenType: data.tokenType,
    });

    await router.push("/dashboard");
  } catch (error) {
    alert("Falha no login: " + (error as Error).message);
  }
};
</script>
