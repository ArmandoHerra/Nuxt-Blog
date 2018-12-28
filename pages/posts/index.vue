<template>
  <div class="posts-page">
    <post-list :posts="postList"/>
  </div>
</template>

<script>
import PostPreview from '@/components/Posts/PostPreview'
import PostList from '@/components/Posts/PostList'
export default {
  components: {
    PostPreview,
    PostList
  },
  data() {
    return {
      postList: this.$store.getters.postList
    }
  }
}
</script>

<style scoped>
.posts-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
