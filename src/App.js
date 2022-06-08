import axios from 'axios';
import Router from './Router';


function App() {
  if (localStorage.getItem('token')) {
    //const access_token = response.data.token;
      const access_token = JSON.parse(window.localStorage.getItem("token")).access_token;
      // const exp = JSON.parse(window.localStorage.getItem("token")).exp;
      // var existing = localStorage.getItem("token");
      // existing = JSON.parse(existing);
      // existing.access_token = access_token;
    
      //window.localStorage.setItem("token", JSON.stringify(existing));
      axios.defaults.headers.common['Authorization'] = "JWT " + access_token;
  }
  // const response = axios.get('https://6007-221-148-180-175.ngrok.io/project/1/MyIssue').then( (res) => {
  //       console.log(res.data);
  //     })
  
  return <Router />;
}
 
export default App;
