import Vuex from 'vuex'
import Cookie from 'js-cookie'

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
            const expirationDate =
              new Date().getTime() + result.expiresIn * 1000
            vuexContext.commit('setToken', result.idToken)
            localStorage.setItem('token', result.idToken)
            localStorage.setItem('expiration', expirationDate)
            Cookie.set('jwt', result.idToken)
            Cookie.set('expirationDate', expirationDate)
            return this.$axios.$post('http://localhost:3000/api/track-data', {
              data: { ...result }
            })
          })
          .catch(error => console.log(error))
      },
      initAuth(vuexContext, req) {
        let token
        let expirationDate
        if (req) {
          if (!req.headers.cookie) return
          const jwtCookie = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('jwt='))
          if (!jwtCookie) return
          token = jwtCookie.split('=')[1]
          expirationDate = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('expirationDate='))
            .split('=')[1]
        } else {
          token = localStorage.getItem('token')
          expirationDate = localStorage.getItem('expiration')
        }
        if (new Date().getTime() > +expirationDate || !token) {
          vuexContext.dispatch('logout')
          return
        }
        vuexContext.commit('setToken', token)
      },
      logout(vuexContext) {
        vuexContext.commit('clearToken')
        Cookie.remove('jwt')
        Cookie.remove('expirationDate')
        if (process.client) {
          localStorage.removeItem('token')
          localStorage.removeItem('expiration')
        }
      }
    }
  })
}

export default createStore
