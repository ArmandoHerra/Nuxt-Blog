<template>
  <div class="admin-page">
    <section class="new-post">
      <app-button @click="$router.push('/admin/new-post')">
        Create Post
      </app-button>
      <app-button @click="onLogout">
        Logout
      </app-button>
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
  middleware: ['check-auth', 'auth'],
  components: {
    AppButton,
    PostList
  },
  computed: {
    postList() {
      return this.$store.getters.postList
    }
  },
  methods: {
    onLogout() {
      this.$store.dispatch('logout')
      this.$router.push('/admin/auth')
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
