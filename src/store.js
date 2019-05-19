import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth';
import globalAxios from 'axios';
import router from './router';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	idToken: null,
  	userId: null,
  	user: null
  },
  mutations: {
  	/**
  	 * We call that state object so we can access any state property 
  	 * and userDate is the name of the object that is gonna be passed by the action to our mutation 
  	 */
  	authUser (state, userData) {
  		state.idToken = userData.token
  		state.userId  = userData.userId
  	},
  	storeUser (state, user) {
  	state.user = user; 
  	},
  	clearAuthData (state) {
  	state.idToken = null; 
  	state.userId  = null;
  	}
  },
  actions: {
  	/**
  	 * an action may only commit to a mutation and never to another action
  	 * dispatch to actions and commit to mutations
  	 */
  	setLogoutTimer ({commit}, expirationTime) { 
  		setTimeout(() => {
  			//commit('logout') //wrong!
  			commit('clearAuthData')
  		} , expirationTime * 1000)
  	},
  	/**
  	 * commit: the mutation name that you're going to commit
  	 * to the mutations object
  	 * authData: the payload data to recieve from the action dipatcher in signin and signup pages
	 	 * 
  	 * We moved the axios post req from signin & signup pages
  	 * to start using vuex instead
  	 */
  	signup({commit, dispatch}, authDate) {
  		  axios.post('/signupNewUser?key=AIzaSyBUjK3Eo1rBEUcqNYoh9eZc26NxSmYvtMk', {
          email : authDate.email,
          password: authDate.password,
          returnSecureToken: true

        })
          .then(res =>{
           console.log(res)
           /**
            * in commit, 
            * first param  => authUser: Mutation name
            * second param => the object we are passing to the mutation which gets the the authData name later in the mutation itself
            */
           commit('authUser', {
           	token: res.data.idToken,
           	userId: res.data.localId
           })

           const now = new Date()
           //Dates are megred in milliseconds. use getTime() for that
           const expirationDate = new Date(now.getTime() + (res.data.expiresIn * 1000))

           /**
            * We are using a local browser API here
            * seems interesting, will do a search later
            */
           localStorage.setItem('token', res.data.idToken)
           localStorage.setItem('userId', res.data.localId)
           localStorage.setItem('expiresIn', expirationDate)

           /**
            * An action 'signup' that is dispatching another action 'storeUser' and is activating its commit
            */
           dispatch('storeUser', authDate)
           dispatch('setLogoutTimer', res.data.expiresIn)
       	})
          .catch(error => console.log(error))
  	},
  	login ({commit, dispatch}, authDate) { 
  		  axios.post('/verifyPassword?key=AIzaSyBUjK3Eo1rBEUcqNYoh9eZc26NxSmYvtMk', {
          email : authDate.email,
          password: authDate.password,
          returnSecureToken: true

        })
          .then(res =>{
           console.log(res)
           const now = new Date()
           const expirationDate = new Date(now.getTime() + (res.data.expiresIn * 1000))
           localStorage.setItem('token', res.data.idToken)
           localStorage.setItem('userId', res.data.localId)
           localStorage.setItem('expiresIn', expirationDate)
           commit('authUser', {
           	token: res.data.idToken,
           	userId: res.data.localId
           })
           dispatch('setLogoutTimer', res.data.expiresIn)
       	})
          
          .catch(error => console.log(error))

  	},
  	tryAutoLogin({commit}) {
  		const token = localStorage.getItem('token')
  		if (!token) { return } 
  		const expirationDate = localStorage.getItem('expirationDate')
  		const now = new Date()
  		if (now >= expirationDate ) { return }
  		const userId = localStorage.getItem('userId')
  		commit('authUser', {
  			token: token,
  			userId: userId
  		})

  	},
  	logout ({commit}) { 
  	  commit('clearAuthData')
  	  localStorage.removeItem('expirationDate')
  	  localStorage.removeItem('userId')
  	  localStorage.removeItem('token')
  	  //localStorage.clear()

  	  router.replace('/signin')
  	},
  	storeUser ({commit, state}, userData) { 
  		if (!state.idToken) { 
  			return 
  		}
  		globalAxios.post('/users.json' + '?auth=' + state.idToken, userData)
  		.then(res => console.log(res))
  		.catch(error => console.log(error))

  	},
  	fetchUser({commit, state}) { 
  		if (!state.idToken) { 
  			return 
  		}
  		globalAxios.get('/users.json' + '?auth=' + state.idToken)
  		 .then(res => {
          console.log(res)
          const data = res.data
          const users = []
          for (let key in data) {
            const user = data[key]
            user.id = key
            users.push(user)
          }
          console.log(users)
          commit('storeUser', users[0])
        })
        .catch(error => console.log(error))
  	}

  },
  getters: {
  	user (state) { 
  		return state.user;
  	},
  	isAuthenticated (state) { 
  		return state.idToken !== null
  	}
  }
})