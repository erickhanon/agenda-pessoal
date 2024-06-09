export default defineNuxtRouteMiddleware((to, from) => {

  if (process.client) {
    const authInfo = localStorage.getItem('authInfo');
    if (!authInfo && to.path !== '/') {
      return navigateTo('/');
    }
  }
})
