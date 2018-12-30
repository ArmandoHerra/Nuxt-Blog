<template>
  <div class="admin-post-page">
    <section class="new-post-form">
      <admin-post-form @submit="onSubmitted"/>
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
  methods: {
    async onSubmitted(postData) {
      await this.$store
        .dispatch('addPost', postData)
        .then(() => this.$router.push('/admin'))
    }
  }
}
</script>

<style scoped>
.new-post-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .new-post-form {
    width: 500px;
  }
}
</style>
