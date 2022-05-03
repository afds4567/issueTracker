import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "antd/dist/antd.css";
import { Form, Button, Select } from "antd";
import { _user } from "../Recoil/atoms";
import { useRecoilValue } from "recoil";
import axios from "axios";
const { Option } = Select;
const provinceData = ['Seoul', 'Gangwon'];
const cityData = {
  Seoul: ['Songpa', 'Gangnam', 'Wenzhou'],
  Gangwon: ['Gangreung', 'Donghae', 'Zhenjiang'],
};
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
  const user = useRecoilValue(_user);
  useEffect(() => {
    
    const tmpdepart = [];
    const tmpcity = {};
    axios.get(`https://5723-221-148-180-175.ngrok.io/dept`)
      .then(async(res) => {
        console.log(res);
        for (let i = 0; i < res.data.length; i++) {
          const depname = res.data[i].dept_name;
          tmpdepart.push(depname);
          let tmp=[];
          for (let j = 0;j<res.data[i].responsibleIssue.length;j++) {
            tmp.push(res.data[i].responsibleIssue[j].responsible_issue_name);
          }
          tmpcity[depname]  = tmp;
        }
        // await res.data.map((dep) => {
        //   tmp.push(dep.dept_name);
        //   let temp = [];
        //   dep.responsibleIssue.map((issue, j) =>
        //     temp.push(issue.responsible_issue_name)
        //   )
        //   console.log("두번째 map" + temp);
        //   tmpcity.dep.dept_name = temp;
        // })
      }
      )
      .finally(async() => {
        
        setDepartment(tmpdepart);
        console.log(tmpcity);
        console.log("chekc1");
        setCity(tmpcity);
        console.log("chekc2");
        console.log(city);
        
      });
  }, []);
  
	//등록 버튼 눌렀을 때 실행 
    const onFinish = (values) => {
      console.log("Success:", firstCity, secondCity);
      console.log(user.name);
      const updateData = { "email":"jiwon@dailyfunding.com", "responsibleIssue": { "responsible_issue_name" : secondCity,"department":{"dept_name":firstCity} }};
      axios.put(`https://5723-221-148-180-175.ngrok.io/signUp/${user.user_id}`, updateData)
      .then(response => {
        console.log(response.data+"회원등록성공~");
    })
      props.changeModal();
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
    console.log(secondCity);
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
              <div style={{marginBottom:"2rem"}}>jiwon@dailyfunding.com</div>
            </>
            : <></>}
          <Form.Item label={<label style={{ color: "black" }}>부서 명</label>}>
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
};

export default Department;