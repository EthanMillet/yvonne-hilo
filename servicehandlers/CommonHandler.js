import axios from 'axios';

export class CommonAPIService {
  constructor() {
    this.api_url = process.env.VUE_APP_API_URL;
    this.ai_url = process.env.VUE_APP_AI_URL;
    this.llm_url = process.env.VUE_APP_LLM_URL;
    this.loggedIn = false;
  }

  newFileCall(url, formData) {
    const fullUrl = this.api_url + url;
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');

    return axios.post(fullUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  }

  // main login method for the code
  login(login, router, store, errors) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('jwtToken');
    return axios.post(`${this.api_url}/api/auth/login`, login)
      .then((response) => {
        localStorage.setItem('jwtToken' + '', response.data.token);
        store.setUser(response.data.user);
        store.setLoggedIn(true);
        const appScopes = [];
        for (const auth_group of response.data.user.auth_groups) {
          for (const scope of auth_group.scopes) {
            appScopes.push(scope);
          }
        }
        store.setAppScopes(appScopes);
        if (appScopes.some(scope => scope.name === 'settings')) {
          store.setViewSettings(true);
        }
        return response.data;
      })
      .catch((e) => {
        console.log('Error: ', e);
        errors.push(e);
        if (e.response.status === 401) {
          router.push({
            name: 'login',
          });
        }
        return {success: false, msg: 'Login Failure'};
      });
  }

  generateOTP(parameters, router) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('jwtToken');
    const fullUrl = `${this.api_url}/api/auth/generate-otp`;
    return axios.get(fullUrl, parameters)
    .then((response) => {
      // console.debug('postCall response', response);
      return response.data
    })
    .catch((error) => {
      if (error.response.status === 401) {
        router.push({
          name: 'login',
        });
      }
      throw error
    });
  }

  verifyOTP(parameters, router) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('jwtToken');
    const fullUrl = `${this.api_url}/api/auth/verify-otp`;
    return axios.post(fullUrl, parameters)
    .then((response) => {
      console.debug('postCall response', response);
      return response.data
    })
    .catch((error) => {
      if (error.response.status === 401) {
        router.push({
          name: 'login',
        });
      }
      throw error
    });
  }

  postCall(url, parameters, router) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('jwtToken');
    const fullUrl = this.api_url + url;
    return axios.post(fullUrl, parameters)
      .then((response) => {
        // console.debug('postCall response', response);
        return response.data
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          router.push({
            name: 'login',
          });
        }
        throw error
      });
  }

  fileCall(url, files, router) {
    const fullUrl = this.api_url + url;
    return axios.post(fullUrl, files,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': localStorage.getItem('jwtToken'),
        }
      })
      .then((response) => {
      return response
      // return response.data
    })
      .catch((error) => {
        if (error.response.status === 401) {
          router.push({
            name: 'login',
          });
        }
        throw error
      });
  }


  deleteCall(url, parameters, router) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('jwtToken');
    const fullUrl = this.api_url + url;
    return axios.delete(fullUrl, parameters)
      .then(response => response.data)
      .catch((error) => {
        if (error.response.status === 401) {
          router.push({
            name: 'Login',
          });
        }
      });
  }

  putCall(url, parameters, router) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('jwtToken');
    const fullUrl = this.api_url + url;
    return axios.put(fullUrl, parameters)
      .then(response => response.data)
      .catch((error) => {
        if (error.response.status === 401) {
          router.push({
            name: 'Login',
          });
        }
        throw error;
      });
  }

  getCall(url, parameters, router) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('jwtToken');
    axios.defaults.timeout = 100000;
    const fullUrl = this.api_url + url;
    return axios.get(fullUrl, { params: parameters })
      .then(response => response.data)
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          router.push({
            name: 'Login',
          });
        }
        // throw error
      });
  }
}

export default CommonAPIService;
