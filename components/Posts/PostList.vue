<template>
  <section class="post-list">
    <post-preview
      v-for="post in posts"
      :is-admin="isAdmin"
      :id="post.id"
      :key="post.id"
      :title="post.title"
      :preview-text="post.previewText"
      :thumbnail="post.thumbnail"/>
  </section>
</template>

<script>
import PostPreview from '@/components/Posts/PostPreview'
export default {
  components: {
    PostPreview
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: false
    },
    posts: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.post-list {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>
