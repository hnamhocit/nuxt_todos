<script setup lang="ts">
const isLogin = ref(true)

const toggleIsLogin = () => {
	isLogin.value = !isLogin.value
}
</script>

<template>
	<AuthLogin
		v-if="isLogin"
		:on-click="toggleIsLogin" />
	<AuthRegister
		v-else
		:on-click="toggleIsLogin" />
</template>
