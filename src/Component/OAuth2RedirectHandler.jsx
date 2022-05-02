import React from "react";
import axios from "axios";
import { useRecoilState } from 'recoil';
import { _user } from "../Recoil/atoms";
const OAuth2RedirectHandler = (props) => {
    //const dispatch = useDispatch();
    //axios.defaults.withCredentials = true;
    // 인가코드
  let code = new URL(window.location.href).searchParams.get("code");
  const [user,setUser] = useRecoilState(_user);
    const sendKakaoTokenToServer = async (token ) => {
      axios.post('https://5723-221-148-180-175.ngrok.io/auth/slack',{access_token: token})
        .then(res => {
        console.log("post실행성공");
        if (res.status == 201 || res.status == 200) {
          setUser(oldData => [
            ...oldData,
            {
              user_id: res.data.user_id,
              name: res.data.name,
            }
            ])
            console.log(res);
            window.localStorage.setItem("token", JSON.stringify({
            access_token: res.data.ACCESS_TOKEN
          })); 
          
          }
        else {
          window.alert("로그인에 실패하였습니다.");
        }
      }).catch(function (error) {
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
            }).then((res) => {
                console.log((res));
                sendKakaoTokenToServer((res.data.access_token));
              
                console.log("백엔드로 access_token 전송 success");
            });
        }
    , []);

    return (
    <div> {code}</div>
   );
};

export default OAuth2RedirectHandler;