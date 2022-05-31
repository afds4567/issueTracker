import React from "react";
import axios from "axios";
import { useRecoilState } from 'recoil';
import { _user } from "../Recoil/atoms";
import { cloneDeep } from 'lodash';
import { useNavigate } from 'react-router';
const OAuth2RedirectHandler = (props) => {
    //const dispatch = useDispatch();
    //axios.defaults.withCredentials = true;
    // 인가코드
  const onSilentRefresh = (refreshtoken) => {
    axios.post('https://6007-221-148-180-175.ngrok.io/token/verify/', { token: refreshtoken })
      .then(res => {
        //refresh토큰 만료된 경우 로그인 페이지로 이동
        if (res.status === 400) {
          window.localStorage.clear();
          axios.defaults.headers.common['Authorization'] = null;
          navigate(`/login`);
        }
        else {
          onLoginSuccess(res);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  const onLoginSuccess = response => {
    //verify로 재발급 아닌 경우
    if (response.data.refresh_token) {
      console.log("verify로 재발급 아닌 경우");
      const { access_token, exp, refresh_token } = response.data;
      window.localStorage.setItem("token", JSON.stringify({
        refresh_token: refresh_token,
        exp:exp,
        access_token: access_token,
      }));
      axios.defaults.headers.common['Authorization'] = "JWT " + access_token;
      setTimeout(function(){onSilentRefresh(refresh_token)}, exp*1000 - 50000);
    }
    //verify로 재발급 한 경우
    else {
      console.log("verify로 재발급 한 경우");
      const access_token = response.data.token;
      const refresh_token = JSON.parse(window.localStorage.getItem("token")).refresh_token;
      const exp = JSON.parse(window.localStorage.getItem("token")).exp;
      var existing = localStorage.getItem("token");
      existing = JSON.parse(existing);
      existing.access_token = access_token;
      window.localStorage.setItem("token", JSON.stringify(existing));
      axios.defaults.headers.common['Authorization'] = "JWT " + access_token;
      setTimeout(function(){onSilentRefresh(refresh_token)}, exp*1000 - 50000);
    }
  }
  let code = new URL(window.location.href).searchParams.get("code");
  const [user, setUser] = useRecoilState(_user);
  const navigate = useNavigate();
  const sendKakaoTokenToServer = async (token ) => {
    axios
      .post('https://6007-221-148-180-175.ngrok.io/auth/slack', { access_token: token })
      .then(res => {
        //최초 접속 시 department에서 이메일 등록 후 token 발급 
        console.log("slack access token 발급 최초 성공");
        if (res.status == 201 || res.status == 200) {
          let clonedUser = cloneDeep(user);
          clonedUser.name = res.data.name;
          clonedUser.user_id = res.data.username;
          setUser(clonedUser);  
          navigate(`/Department`);
        }
        //slack 허용 버튼 클릭 시 user 정보 이미 DB에 등록되어있는 경우 
        else if (res.status === 202) {
          let clonedUser = cloneDeep(user);
          clonedUser.name = res.data.name;
          clonedUser.user_id = res.data.username;
          setUser(clonedUser);
          axios
            .post('https://6007-221-148-180-175.ngrok.io/token/', { username: res.data.username })
            .then(res => {
              console.log(res.data, "access,refresh token 발급 성공");
              if (res.status == 201 || res.status == 200) {
                onLoginSuccess(res);
                navigate(`/project`);
              } 
              else{
                console.log(res);
                window.alert("이미 DB에 존재 로그인에 실패하였습니다.");
              }
            })
        }
      })
      .catch(function (error) {
        console.log(error);
      })    
  }
    React.useEffect( () => {
        console.log("리다이렉트" + code);
        // const jwttoken = localStorage.getItem("token");
        // if (jwttoken) {
        //     axios.post('https://5723-221-148-180-175.ngrok.io/auth/slack', {
        //         headers: {
        //             Authorization: jwttoken,
        //         },
        //     }).then((res) => { console.log(res);   })
        // }
        // else {
        const data = {
          code,
          client_id: `1652575731968.3442202545104`,
          client_secret: `f738cca774454f8302a999dfc35a1231`,
          grant_type: "authorization_code"
        };
        const queryString = Object.keys(data)
          .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
          .join('&');
        axios.post('https://slack.com/api/openid.connect.token', queryString, {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }
        )
          .then((res) => {
          console.log((res));
          sendKakaoTokenToServer((res.data.access_token));
          console.log("백엔드로 access_token 전송 success");
        });
        }
    , []);

  return (
    <div style={{backgroundColor:"#FD7272"}}>
      <div> {code}</div>
      <h1>리다이렉트 중입니다</h1>
    </div>
  );
}

export default OAuth2RedirectHandler;