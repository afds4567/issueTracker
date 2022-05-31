import React, { useEffect } from "react";
import { useRecoilState } from 'recoil';
import { _user,isLoggedInRecoil } from "../Recoil/atoms";
import { cloneDeep } from 'lodash';
import { useNavigate } from 'react-router';
import queryString from 'query-string';
import axios from 'axios';
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid'
import { ReactComponent as Slackbtn } from './slack-icon.svg';

const StyledBody = styled.body`
  height: ${(props) => (props.modal ? "60vh" : "100vh")};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Lato', sans-serif;
  background-color: #ef5777;
  flex-direction: column;
`

const nonce = "your-own-nonce-value";
const clientId = `1652575731968.3442202545104`;
const clientSecret = `f738cca774454f8302a999dfc35a1231`;
const oidcScopes = "openid,email,profile"; // openid is required at least
const redirectUri = `https://dc12-221-148-180-175.ngrok.io/slack/oauth_redirect`;

class MyStateStore {
  constructor() {
    this.activeStates = {};
  }
  async generate() {
    const newValue = uuidv4();
    this.activeStates[newValue] = Date.now() + 10 * 60 * 1000; // 10 minutes
    return newValue;
  }
  async validate(state) {
    const expiresAt = this.activeStates[state];
    if (expiresAt && Date.now() <= expiresAt) {
      delete this.activeStates[state];
      return true;
    }
    return false;
  }
}
const myStateStore = new MyStateStore();
const LoginSlack = (props) => {
	const state = myStateStore.generate();
	const slackauthURI=`https://slack.com/openid/connect/authorize?response_type=code&client_id=${clientId}&scope=${oidcScopes}&redirect_uri=${redirectUri}&nonce=${nonce}`;
	const query = queryString.parse(window.location.search);
	const [user, setUser] = useRecoilState(_user);
	const [isLogin,setIsLogin] = useRecoilState(isLoggedInRecoil);
  const navigate = useNavigate();
	useEffect(() => {
		if (query.code) {
			console.log(query);
			getAccessTokenHandler(query.code.toString());
		}
		const jwttoken = localStorage.getItem("token");
		const token = JSON.parse(jwttoken);
		// if (token) {
		// 	const access = token.access_token;
		// 	// if (token && jwttoken) {
		// 	console.log(typeof(access));
		// 	axios.post('https://682a-221-148-180-175.ngrok.io/auth/ITS',null, {
		// 		headers: {
		// 				'Content-Type': 'application/json',
		// 				'Authorization': `${access}`
		// 		},
		// 	}).then((res) => {
		// 		let clonedUser = cloneDeep(user);
		// 		//clonedUser.name = res.data.name;
		// 		clonedUser.user_id = res.data.username;
		// 		let clonedIsLogin = cloneDeep(isLogin);
		// 		clonedIsLogin= true;
		// 		setUser(clonedUser);
		// 		setIsLogin(clonedIsLogin);
		// 		console.log(clonedIsLogin);
		// 		console.log(isLogin);
		// 		navigate('/');
		// 	})
		// }       
	}, []);
	const getAccessTokenHandler = async (code) => {
		const data = {
			code,
			client_id: `1652575731968.3442202545104`,
			client_secret: `f738cca774454f8302a999dfc35a1231`,
			grant_type: "authorization_code"
		};
		const queryString = Object.keys(data)
		.map((k)=> encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
			.join('&');
		axios.post('https://slack.com/api/openid.connect.token', queryString, {
			headers: {
				'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
			}
		}).then((res) => {
			console.log("success");
		});
	}
       
	return (
		<>
			<StyledBody>
			<a href={slackauthURI} style={{
				alignIitems: "center", color: "#000", backgroundColor: "#fff", border: "1px solid #ddd"
				, borderRadius: "4px", display: "inline-flex", fontFamily: "Lato, sans-serif", fontSize: "16px", fontWeight: "600",
				height: "48px", justifyContent: "center", textDecoration: "none", width: "256px"
			}}>
			<div style={{margin:"auto"}}><Slackbtn /><span>Sign in with Slack</span></div>
			</a>
			</StyledBody>
		</>
  );
}

export default LoginSlack;