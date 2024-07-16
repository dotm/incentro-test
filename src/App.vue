<script lang="ts">
import { defineComponent, ref } from 'vue'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'

import Posts from './Posts.vue'

export default defineComponent({
  name: 'App',
  components: { Posts, VueQueryDevtools },
  setup() {},
})
</script>

<template>
  <h1>Posts CRUD</h1>
  <Posts />
  <VueQueryDevtools />
</template>
