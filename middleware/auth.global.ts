import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to) => {
	const userStore = useUserStore()

	const publicRoutes = ['/auth/login', '/auth/register']

	watchEffect(() => {
		if (!userStore.loading && !userStore.user) {
			if (publicRoutes.includes(to.path)) {
				return
			}

			return navigateTo('/auth/login')
		}
	})
})
