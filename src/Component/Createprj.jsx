import useAsync from "./useAsync"
import { useRef,useState } from "react";
import "antd/dist/antd.css";
import { Form, Button, Select } from "antd";
import axios from "axios";

export default function CreatePrj(props) {
    async function getUsers() {
        const response = await axios.get(
        'http://localhost:4000/data'
        );
        return response.data;
    }
    const [projects, setProject] = useAsync(getUsers, []);

    const [choice,setChoice] =useState('');
    //const history = useHistory();
    const [form] = Form.useForm();
    const onFinish = (values) => {
    console.log("Success:", values);
    };
    const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  function onSubmit(e) {
    e.preventDefault();
    props.changeModal();
    fetch("http://localhost:4000/data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },  //요청 헤더
        body: JSON.stringify({
            id: projects.length + 1,
            title: choice,
            description: choice + "입니다"
        }),
    }).then((res) => {
        if (res.ok) {
            alert("성공적으로 추가되었습니다.");
            //history.push(`/data/${projects.length}`);
        }
    });
  }
  function handleChange(value) {
    console.log(value.label); // { key: "lucy", label: "Lucy (101)" }
    setChoice(value.label);
  }   
    
  return (
    <>
    <body
      style={{
        height: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Lato', sans-serif",
        backgroundColor: "#black",
        flexDirection: "column"
      }}
    >
      <h1 style={{ marginBottom: "3rem" }}>프로젝트 생성</h1>
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
        style={{ width: "40%" }}
      >
      <Form.Item>
        {/* 전체 부서 API로 받아와서 map 형식으로 뿌려주기-> 새로운 부서 생성시  */}
          <Select placeholder="담당부서" onChange={handleChange} labelInValue defaultValue={{ key: 'it' }}>
            <Select.Option value="it">It팀</Select.Option>
            <Select.Option value="manage">상품기획팀</Select.Option>
            <Select.Option value="brand">디자인팀</Select.Option>
            <Select.Option value="support">경영지원팀</Select.Option>
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

        <Form.Item>
          <Button
          onClick={onSubmit}
            type={"primary"}
            htmlType={"submit"}
            xs={{ span: 10, offset: 2 }}
            lg={{ span: 6, offset: 2 }}
            className={"department-form-button"}
            style={{ marginTop: "1rem" }}
            block
          >
            생성 완료
          </Button>
        </Form.Item>
      </Form>
    </body>
  </>
    )
}