<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'

import type { Post } from './types'
import PostDetail from './Post.vue'

const fetcher = async (): Promise<Post[]> =>
  await fetch('https://jsonplaceholder.typicode.com/posts').then((response) =>
    response.json(),
  )

export default defineComponent({
  name: 'PostsList',
  components: { PostDetail },
  setup() {
    const state = reactive({
      title: "",
      body: "",
    });
    const {
      isPending: isPendingForList,
      isError: isErrorForList,
      isFetching: isFetchingForList,
      data: dataForList,
      error: errorForList,
      refetch: refetchList,
    } = useQuery({
      queryKey: ['posts'],
      queryFn: fetcher,
    })

    const {
      isPending: isPendingForCreate,
      isError: isErrorForCreate,
      error: errorForCreate,
      isSuccess: isSuccessForCreate,
      mutate: callCreatePost,
    } = useMutation({
      mutationFn: async () => {
        await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          body: JSON.stringify({
            title: state.title,
            body: state.body,
            userId: 1,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((response) => response.json())
        refetchList()
      },
    })

    const createPost = () => {
      callCreatePost()
    };
    watch(isSuccessForCreate, (success) => {
      if (success) {
        alert("Success creating post")
        refetchList()
      }
    })

    return {
      isPendingForList, isErrorForList, isFetchingForList, dataForList, errorForList, refetchList,
      isPendingForCreate, isErrorForCreate, errorForCreate,
      ...toRefs(state),
      createPost,
    }
  },
})
</script>

<template>
  <h1>Posts</h1>
  <div class="flex flex-col w-30">
    <input type="text" name="new-post-title" id="new-post-title" placeholder="Title" v-model="title">
    <input type="text" name="new-post-body" id="new-post-body" placeholder="Body" v-model="body">
    <button @click="createPost" :disabled="isPendingForCreate">Add new post</button>
    <div v-if="isErrorForCreate">An error has occured when creating post: {{ errorForCreate }}</div>
  </div>
  <div v-if="isPendingForList">Loading...</div>
  <div v-else-if="isErrorForList">An error has occurred: {{ errorForList }}</div>
  <div v-else-if="dataForList">
    <ul>
      <PostDetail v-for="item in dataForList" :post=item :key="item.id" @mutate-post="refetchList"/>
    </ul>
  </div>
</template>
