import useAsync from "./useAsync"
import {useState } from "react";
import "antd/dist/antd.css";
import { Form, Button, Select,Input } from "antd";
import axios from "axios";
import { useNavigate } from 'react-router';

async function getProjects() {
    const response = await axios.get(
    'https://682a-221-148-180-175.ngrok.io/project'
    );
    return response.data;
}
  
export default function CreatePrj(props) {
  const [projects, setProject] = useAsync(getProjects, []);
  const [dep,setDep] = useState("");
  const [choice,setChoice] =useState('');
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
    console.log(projects.data.length); 
    axios.post('https://682a-221-148-180-175.ngrok.io/project/', {
      project_id: projects.data.length + 1,
      project_name: dep,
      board_type: choice
    })
    .then((res) => {
      if (res.ok) {
        alert("성공적으로 추가되었습니다.");
        navigate(`/project/${projects.data.length+1}`);
      }
    });
  }
  function handleTypeChange(value) {
    console.log(value.label); // { key: "lucy", label: "Lucy (101)" }
    setChoice(value.label);
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
      <Form.Item label={<label style={{ color: "black" }}>칸반 보드 타입</label>}>
        {/* 전체 부서 API로 받아와서 map 형식으로 뿌려주기-> 새로운 부서 생성시  */}
        <Select placeholder="타입을 선택하세요" onChange={handleTypeChange} labelInValue >
          <Select.Option value="개발">개발</Select.Option>
          <Select.Option value="비개발">비개발</Select.Option>
        </Select>
      </Form.Item>
          
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