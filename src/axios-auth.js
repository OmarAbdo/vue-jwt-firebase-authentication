import axios from 'axios'

/**
 * This is the right endpoint for firebase authintication signup
 * you can find more at https://firebase.google.com/docs/reference/rest/auth/#section-create-email-password
 * as for the base URL you only write the first part of the the provided url tell 'relyingparty' then the rest of it always changes 
 * in which case and therefore we should write in with the right params in each axios request
 */
const instance = axios.create({

  baseURL : 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
})

//instance.defaults.headers.common['SOMETHING'] = 'something'

export default instance

