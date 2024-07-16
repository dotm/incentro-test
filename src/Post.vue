<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs, watch } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'

import type { Post } from './types'

export default defineComponent({
  name: 'PostDetails',
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true
    }
  },
  emits: ['mutatePost'],
  setup(props, { emit }) {
    const state = reactive({
      title: props.post.title,
      body: props.post.body
    });

    const {
      isPending: isPendingForUpdate,
      isError: isErrorForUpdate,
      error: errorForUpdate,
      isSuccess: isSuccessForUpdate,
      mutate: callUpdatePost,
    } = useMutation({
      mutationFn: async () => {
        await fetch('https://jsonplaceholder.typicode.com/posts/' + props.post.id, {
          method: 'PUT',
          body: JSON.stringify({
            id: props.post.id,
            title: state.title,
            body: state.body,
            userId: 1,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((response) => response.json())
      },
    })
    watch(isSuccessForUpdate, (success) => {
      if (success) {
        alert("Success updating post")
        emit('mutatePost');
      }
    })
    
    const updatePost = () => {
      callUpdatePost()
    };

    const {
      isPending: isPendingForDelete,
      isError: isErrorForDelete,
      error: errorForDelete,
      isSuccess: isSuccessForDelete,
      mutate: callDeletePost,
    } = useMutation({
      mutationFn: async () => {
        await fetch('https://jsonplaceholder.typicode.com/posts/' + props.post.id, {
            method: 'DELETE',
          })
          .then((response) => response.json())
      },
    })
    watch(isSuccessForDelete, (success) => {
      if (success) {
        alert("Success deleting post")
        emit('mutatePost');
      }
    })
    const deletePost = () => {
      callDeletePost()
    };

    const isLoading = computed(() => isPendingForUpdate || isPendingForDelete)

    return {
      ...toRefs(state),
      isErrorForUpdate, errorForUpdate, isPendingForUpdate, updatePost,
      isErrorForDelete, errorForDelete, isPendingForDelete, deletePost,
      isLoading,
    }
  },
})
</script>

<template>
  <div class="flex flex-col w-50">
    <p>Post {{ $props.post.id }}</p>
    <input type="text" :name="`post-title-${$props.post.id}`" :id="`post-title-${$props.post.id}`" placeholder="Title" v-model="title">
    <input type="text" :name="`post-body-${$props.post.id}`" :id="`post-body-${$props.post.id}`" placeholder="Body" v-model="body">
    <button @click="updatePost" :disabled="isLoading.value">Update</button>
    <button @click="deletePost" :disabled="isLoading.value">Delete</button>
    <div v-if="isErrorForUpdate">An error has occured when updating post: {{ errorForUpdate }}</div>
    <div v-if="isErrorForDelete">An error has occured when deleting post: {{ errorForDelete }}</div>
  </div>
</template>
