import axios from 'axios';
const userAPI = axios.create({
    baseURL: process.env.REACT_APP_API_URL + "/api/users",
    withCredentials: true
})
const postAPI = axios.create({
  baseURL: `http://localhost:5555`,
  
  
})


class Api {
  async uploadImage(data) {
    const response = await postAPI.post('/upload_files', data);
    return response.data;
  }
}
export default Api;