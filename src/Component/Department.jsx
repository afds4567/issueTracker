import React, { useState, useCallback } from "react";
import styled from "styled-components";
import "antd/dist/antd.css";
import { Form, Button, Select } from "antd";

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
  const [firstCity, setFirstCity] = useState("Seoul");
	const [cities, setCities] = useState(cityData[provinceData[0]]);
	const [secondCity, setSecondCity] = useState(cityData[provinceData[0]][0]);
	//등록 버튼 눌렀을 때 실행 
  const onFinish = (values) => {
    console.log("Success:", firstCity, secondCity);
    props.changeModal();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
	};
	
	const handleProvinceChange = value => {
    //console.log(value);
    setFirstCity(value);
    setCities(cityData[value]);
    setSecondCity(cityData[value][0]);
  };
	const onSecondCityChange = value => {
			setSecondCity(value);
	};
	// const onSubmitForm = (e) => {
  //   e.preventDefault();
  //   props.changeModal();
	// 	console.log("hi");
	// };
    return (
      <>
      <StyledBody modal={props.modal}>
          {props.modal ?
            <>
              <h1 style={{ marginTop: "-6rem" }}>마이페이지</h1>
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
              <div style={{marginTop:"4rem"}}>내 슬랙 ID</div>
              <div style={{marginBottom:"2rem"}}>jiwon@dailyfunding.com</div>
            </>
            : <></>}
          <Form.Item label={<label style={{ color: "black" }}>부서 명</label>}>
            <Select defaultValue={provinceData[0]} onChange={handleProvinceChange} >
							{provinceData.map(province => (
							<Option key={province}>{province}</Option>
							))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<label style={{ color: "black" }}>담당 이슈</label>}
          >
            <Select value={secondCity} onChange={onSecondCityChange}>
        			{cities.map(city => (
          			<Option key={city}>{city}</Option>
        			))}
            </Select>
          </Form.Item>

          {/* <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16
            }}
          >
            <Checkbox>Remember me</Checkbox>
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
      </StyledBody>
    </>
  );
};

export default Department;