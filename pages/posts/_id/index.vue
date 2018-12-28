<template>
  <div class="single-post-page">
    <section class="post">
      <h1>{{ post.title }}</h1>
      <img :src="post.thumbnail">
      <div class="post-details">
        <div>Last updated on: {{ post.updatedDate }}</div>
        <div>Written by: {{ post.author }}</div>
      </div>
      <p>{{ post.content }}</p>
    </section>
    <section class="post-feedback">
      <p>Let me think what you think about this post at: <a>armandoherra369@gmail.com</a></p>
    </section>
  </div>
</template>

<script>
export default {
  async asyncData(context) {
    return await context.$axios
      .$get(
        `https://nuxt-blog-7294a.firebaseio.com/posts/current/${
          context.params.id
        }.json`
      )
      .then(res => {
        return {
          post: res
        }
      })
      .catch(error => {
        context.error(error)
      })
  }
}
</script>


<style scoped>
.single-post-page {
  padding: 30px;
  text-align: center;
  box-sizing: border-box;
}

.post {
  width: 100%;
}

@media (min-width: 768px) {
  .post {
    width: 600px;
    margin: auto;
  }
}

.post-title {
  margin: 0;
}

.post-details {
  padding: 10px;
  box-sizing: border-box;
  border-bottom: 3px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

@media (min-width: 768px) {
  .post-details {
    flex-direction: row;
  }
}

.post-detail {
  color: rgb(88, 88, 88);
  margin: 0 10px;
}

.post-feedback a {
  color: red;
  text-decoration: none;
}

.post-feedback a:hover,
.post-feedback a:active {
  color: salmon;
}
</style>
