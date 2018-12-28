<template>
  <div class="admin-page">
    <section class="new-post">
      <app-button @click="$router.push('/admin/new-post')">Create Post</app-button>
    </section>
    <section class="existing-posts">
      <h1>Existing Posts</h1>
      <post-list 
        :posts="postList" 
        is-admin/>
    </section>
  </div>
</template>

<script>
import AppButton from '@/components/UI/AppButton'
import PostList from '@/components/Posts/PostList'
export default {
  layout: 'admin',
  components: {
    AppButton,
    PostList
  },
  async asyncData(context) {
    return await context.$axios
      .$get('https://nuxt-blog-7294a.firebaseio.com/posts.json')
      .then(res => {
        const postList = []
        for (const key in res.current) {
          postList.push({
            ...res.current[key],
            id: key
          })
        }
        context.store.commit('setPostList', postList)
      })
      .catch(error => console.log(error))
  },
  data() {
    return {
      postList: this.$store.getters.postList
    }
  }
}
</script>

<style scoped>
.admin-page {
  padding: 20px;
}

.new-post {
  text-align: center;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
}

.existing-posts h1 {
  text-align: center;
}
</style>
