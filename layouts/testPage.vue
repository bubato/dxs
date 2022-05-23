<template>
  <div class="flex flex-col h-screen mt-10">
    <main class="flex-grow">
      <h1 class="text-2xl text-center">DXSプロジェクトテストページ確認用</h1>
      <p class="mt-1 text-center">
        <nuxt-link to="/playground/"
          >各コンポーネント確認はこちらから</nuxt-link
        >
      </p>
      <Nuxt />
    </main>
    <AreaLabel />
  </div>
</template>

<script>
export default {
  middleware: 'checkAuth',
  components: {},
  created() {},
  mounted() {},
}
</script>

<style></style>
