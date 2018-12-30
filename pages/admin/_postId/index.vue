<template>
  <div class="admin-post-page">
    <section class="update-form">
      <admin-post-form 
        :post="loadedPost" 
        @submit="onSubmitted"/>
    </section>
  </div>
</template>

<script>
import AdminPostForm from '@/components/Admin/AdminPostForm'
export default {
  layout: 'admin',
  middleware: ['check-auth', 'auth'],
  components: {
    AdminPostForm
  },
  async asyncData(context) {
    return await context.$axios
      .$get(
        `${process.env.firebaseUrl}/posts/current/${context.params.postId}.json`
      )
      .then(res => {
        return {
          loadedPost: { ...res, id: context.params.postId }
        }
      })
      .catch(error => context.error(error))
  },
  methods: {
    async onSubmitted(editedPost) {
      await this.$store
        .dispatch('editPost', editedPost)
        .then(() => this.$router.push('/admin'))
    }
  }
}
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
