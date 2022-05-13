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
const { Option } = Select;
const StyledBody = styled.body`
  height: ${(props) => (props.modal ? "60vh" : "100vh")};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Lato', sans-serif;
  background-color: white;
  flex-direction: column;
`
const Department = (props) => {
  const [form] = Form.useForm();
  const [department, setDepartment] = useState([]);
  const [city,setCity] = useState({});
  const [firstCity, setFirstCity] = useState("");
  const [cities, setCities] = useState("");
  const [secondCity, setSecondCity] = useState("");
  const [email,setEmail] = useState("");
  const user = useRecoilValue(_user);
  const [login,setLogin] = useRecoilState(isLoggedInRecoil)
  const navigate = useNavigate();
  // useEffect(() => {
  //   const tmpdepart = [];
  //   const tmpcity = {};
  //   axios.get(`https://5723-221-148-180-175.ngrok.io/dept`)
  //     .then(async(res) => {
  //       console.log(res);
  //       for (let i = 0; i < res.data.length; i++) {
  //         const depname = res.data[i].dept_name;
  //         tmpdepart.push(depname);
  //         let tmp=[];
  //         for (let j = 0;j<res.data[i].responsibleIssue.length;j++) {
  //           tmp.push(res.data[i].responsibleIssue[j].responsible_issue_name);
  //         }
  //         tmpcity[depname]  = tmp;
  //       }
  //     })
  //     .finally(async() => {
  //       setDepartment(tmpdepart);
  //       setCity(tmpcity);
  //     });
  // }, []);
  //등록 버튼 눌렀을 때 실행
  const onFinish = (values) => {
    console.log("Success:", firstCity, secondCity);
    console.log((secondCity));
    console.log(user.name + email);
    //const updateData = { "email":email, "responsibleIssue": { "responsible_issue_name" : secondCity,"department":{"dept_name":firstCity} }};
    const updateData = { "email":email};
    axios.put(`https://b87c-221-148-180-175.ngrok.io/signUp/${user.user_id}`, updateData)
    .then(response => {
      console.log(response.data + "회원등록성공~ tokenobtain 성공");
     // user_id: user.user_id, name: user.name
      axios.post('https://b87c-221-148-180-175.ngrok.io/token/obtain/', {username:user.user_id  })
      .then(res => {
      console.log(response.data + "회원등록성공~obtain res then 성공");
        if (res.status == 201 || res.status == 200) {
          window.localStorage.setItem("token", JSON.stringify({
            access_token: res.data.access_token,
            refresh_token: res.data.refresh_token
        }));
        
        navigate(`/project`);
        }
      else {
        window.alert("로그인에 실패하였습니다.");
      }
      })
    })
    setLogin(true);
    navigate('/');
    //props.changeModal();
  }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleProvinceChange = value => {
    console.log(value);
    setFirstCity(value);
    setCities(city[value]);
    setSecondCity(city[value][0]);
    console.log("setCities" + cities);
  };
  const onSecondCityChange = value => {
    setSecondCity(value);
    console.log("onSecondCityChange")
    console.log(value);
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
            //requiredMarkValue:requiredMark
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
          
        {/* <Form.Item label={<label style={{ color: "black" }}>부서 명</label>}>
          <Select defaultValue={department[0]} onChange={handleProvinceChange} >
            {department.map(province => (
            <Option key={province}>{province}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={<label style={{ color: "black" }}>담당 이슈</label>}
        >
          <Select value={secondCity} onChange={onSecondCityChange}>
            {cities && cities.map(city => (
              <Option key={city}>{city}</Option>
            ))}
          </Select>
        </Form.Item> */}
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