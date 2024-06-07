import { ref, computed } from 'vue'

export interface AuthInfo {
  id: number
  username: string
  tipos: string[]
  accessToken: string
  tokenType: string
}

export function useAuth() {
  const authInfo = ref<AuthInfo | null>(null)

  function setAuthInfo(info: AuthInfo) {
    authInfo.value = info
    if (process.client) {
      localStorage.setItem('authInfo', JSON.stringify(info))
    }
  }

  function loadAuthInfo() {
    if (process.client) {
      const storedAuthInfo = localStorage.getItem('authInfo')
      if (storedAuthInfo) {
        authInfo.value = JSON.parse(storedAuthInfo)
      }
    }
  }

  function clearAuth() {
    authInfo.value = null
    if (process.client) {
      localStorage.removeItem('authInfo')
    }
  }

  const isAuthenticated = computed(() => !!authInfo.value?.accessToken)
  const token = computed(() => authInfo.value?.accessToken || '')
  const userId = computed(() => authInfo.value?.id || '')

  return { authInfo, setAuthInfo, loadAuthInfo, clearAuth, isAuthenticated, token, userId }
}
