import useAsync from "./useAsync"
import {useState,useEffect } from "react";
import "antd/dist/antd.css";
import { Form, Button,Input } from "antd";
import axios from "axios";
import { useNavigate } from 'react-router';
async function getProjects() {
    const response = await axios.get(
    'https://6007-221-148-180-175.ngrok.io/project'
    );
    return response.data;
}
export default function CreatePrj(props) {
  const [projects, setProject] = useAsync(getProjects, []);
  const [dep,setDep] = useState("");
  const navigate = useNavigate();
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
    console.log(projects);
    console.log(projects.data.length); 
    axios.post('https://6007-221-148-180-175.ngrok.io/project/', {
      project_id: projects.data.length + 1,
      project_name: dep,
    })
      .then((res) => {  
      if (res.status==201) {
        alert("성공적으로 추가되었습니다.");
        navigate(`/project/${projects.data.length+1}`);
      }
    });
  }

  const handleInput = (e) => {
    setDep(e.target.value);
  };  
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
        name="type"
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
      <Form.Item label={<label style={{ color: "black" }}>담당 부서</label>}>
        <Input onChange={handleInput}/>
      </Form.Item>
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