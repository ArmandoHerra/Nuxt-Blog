import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      postList: [],
      token: null
    },
    getters: {
      postList: state => state.postList,
      isAuth: state => state.token != null
    },
    mutations: {
      setPostList: (state, postList) => (state.postList = postList),
      addPost: (state, post) => state.postList.push(post),
      editPost(state, editedPost) {
        const postIndex = state.postList.findIndex(
          post => post.id === editedPost.id
        )
        state.postList[postIndex] = editedPost
      },
      setToken: (state, token) => (state.token = token),
      clearToken: state => (state.token = null)
    },
    actions: {
      async nuxtServerInit(vuexContext) {
        return await this.$axios
          .$get(`${process.env.firebaseUrl}/posts.json`)
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
            `${process.env.firebaseUrl}/posts/current.json?auth=${
              vuexContext.state.token
            }`,
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
            `${process.env.firebaseUrl}/posts/current/${
              editedPost.id
            }.json?auth=${vuexContext.state.token}`,
            editedPost
          )
          .then(res => {
            vuexContext.commit('editPost', editedPost)
          })
          .catch(error => console.log(error))
      },
      authenticateUser(vuexContext, payload) {
        let authURL = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
          process.env.firebaseKey
        }`
        if (!payload.isLogin) {
          authURL = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
            process.env.firebaseKey
          }`
        }
        return this.$axios
          .$post(authURL, {
            email: payload.email,
            password: payload.password,
            returnSecureToken: true
          })
          .then(result => {
            vuexContext.commit('setToken', result.idToken)
            vuexContext.dispatch('setLogoutTimer', result.expiresIn * 1000)
          })
          .catch(error => console.log(error))
      },
      setLogoutTimer(vuexContext, duration) {
        setTimeout(() => {
          vuexContext.commit('clearToken')
        }, duration)
      }
    }
  })
}

export default createStore
