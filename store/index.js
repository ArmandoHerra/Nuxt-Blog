import Vuex from 'vuex'

// https://nuxt-blog-7294a.firebaseio.com/

const createStore = () => {
  return new Vuex.Store({
    state: {
      postList: []
    },
    getters: {
      postList: state => state.postList
    },
    mutations: {
      setPostList: (state, payload) => (state.postList = payload),
      addPost: (state, payload) => state.postList.push(payload),
      editPost(state, payload) {
        const postIndex = state.postList.findIndex(
          post => post.id === payload.id
        )
        state.postList[postIndex] = payload
      }
    },
    actions: {
      async nuxtServerInit(vuexContext, context) {
        return await this.$axios
          .$get('https://nuxt-blog-7294a.firebaseio.com/posts.json')
          .then(res => {
            const postsArray = []
            for (const key in res.current) {
              postsArray.push({
                ...res.current[key],
                id: key
              })
            }
            vuexContext.commit('setPostList', postsArray)
          })
          .catch(error => console.log(error))
      },
      setPostList: (vuexContext, payload) =>
        vuexContext.commit('setPostList', payload),
      addPost(vuexContext, payload) {
        const addedPost = {
          ...payload,
          updatedDate: new Date()
        }
        return this.$axios
          .$post(
            'https://nuxt-blog-7294a.firebaseio.com/posts/current.json',
            addedPost
          )
          .then(res => {
            vuexContext.commit('addPost', { ...addedPost, id: res.name })
          })
          .catch(error => console.log(error))
      },
      editPost(vuexContext, payload) {
        const editedPost = {
          ...payload,
          updatedDate: new Date()
        }
        return this.$axios
          .$put(
            `https://nuxt-blog-7294a.firebaseio.com/posts/current/${
              editedPost.id
            }.json`,
            editedPost
          )
          .then(res => {
            vuexContext.commit('editPost', editedPost)
          })
          .catch(error => console.log(error))
      }
    }
  })
}

export default createStore
