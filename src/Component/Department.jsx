import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { UserOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { useNavigate } from 'react-router';
import { Form, Input,Button, Select } from "antd";
import { _user,isLoggedInRecoil } from "../Recoil/atoms";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { useRecoilState } from "recoil";
const StyledBody = styled.body`
  height: ${(props) => (props.modal ? "60vh" : "100vh")};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Lato', sans-serif;
  background-color: white;
  flex-direction: column;
`
const onSilentRefresh = (refreshtoken) => {
  axios.post('/token/verify/', { token:refreshtoken})
    .then(onLoginSuccess)
    .catch(error => {
        console.log(error);
    });
}
const onLoginSuccess = response => {
  const { access_token, exp, refresh_token } = response.data;
   window.localStorage.setItem("token", JSON.stringify({
    refresh_token: refresh_token,
    access_token: access_token,
  }));
  axios.defaults.headers.common['Authorization'] = "JWT " + access_token;
  setTimeout(function(){onSilentRefresh(refresh_token)}, exp*1000 - 30000);
}
const Department = (props) => {
  const [form] = Form.useForm();
  const [email,setEmail] = useState("");
  const user = useRecoilValue(_user);
  const [login,setLogin] = useRecoilState(isLoggedInRecoil)
  const navigate = useNavigate();
  useEffect(() => {
    if (login) {
      console.log(login); navigate('/project');
    }
  }, [login])
  
  //등록 버튼 눌렀을 때 실행
  const onFinish = (values) => {
    const updateData = { "email": email };
    //const access_token =JSON.parse(window.localStorage.getItem("token")).access_token;
    //console.log(access_token);
    // if (window.localStorage.getItem("token")) {
    //   const access_token = JSON.parse(window.localStorage.getItem("token")).access_token;
    //   axios.defaults.headers.common['Authorization'] = `JWT ${access_token}`
    // }
    //console.log(access_token);
    axios.put(`https://6007-221-148-180-175.ngrok.io/signUp/${user.user_id}`, updateData)
    .then(response => {
      console.log(response.data, "회원등록성공~ /signUp 성공");
      axios.post('https://6007-221-148-180-175.ngrok.io/token/', {username:user.user_id  })
        .then(res => {
          console.log("57번줄",res.data.access_token);
          console.log(res.data, "access refreshtoken 최초 발급 성공");
          if (res.status == 201 || res.status == 200) {
            console.log("if문 내부", res.status)
            console.log("엑세스토큰",res.data.access_token)
            axios.defaults.headers.common['Authorization'] = "JWT " + res.data.access_token;
            onLoginSuccess(res);setLogin(true);
            //(axios.defaults.headers.common['Authorization'] = "JWT " + res.data.access_token);
        }
        else if (res.status === 202) {
          console.log(res);
          window.alert("이미 DB에 존재 로그인에 실패하였습니다.");
      }
        })
      
    })
    window.alert("로그인 성공")
    
    // navigate('/project');
  }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleInput = (e) => {
    setEmail(e.target.value);
  };
  return (
    <>
      <StyledBody modal={props.modal}>
        {props.modal ?
          <>
            <h1 style={{ marginTop: "-4rem" }}>마이페이지</h1>
          </>
          : <></>}
        <Form
          form={form}
          name="depart"
          layout="vertical"
          xs={{ span: 10, offset: 2 }}
          lg={{ span: 7, offset: 3 }}
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={{ width: "50%" }}
        >
        {props.modal ?
          <>
            <div style={{marginTop:"5rem"}}>내 슬랙 ID</div>
            <div style={{marginBottom:"2rem"}}>jiwon@daily-funding.com</div>
          </>
            : 
          <></>
        }
        <Form.Item label={<label style={{ color: "black" }}>이메일</label>}>
            <Input
              onChange={handleInput}
              prefix={<UserOutlined className={"site-form-item-icon"} />}
              placeholder={"@daily-funding.com"}
          />
        </Form.Item>
        <Form.Item >
          <Button
            //onClick={onSubmitForm}
            type={"primary"}
            htmlType={"submit"}
            xs={{ span: 10, offset: 2 }}
            lg={{ span: 6, offset: 2 }}
            className={"department-form-button"}
            block
          >
          {props.modal ? "수정" : "등록"}
          </Button>
        </Form.Item>
        </Form>
        <div>{user.user_id}</div>
    </StyledBody>
  </>
);
}
export default Department;

