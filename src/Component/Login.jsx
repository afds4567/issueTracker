import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { Form, Input, Button } from "antd";

const Login = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onClick = () => {
    window.location.href="/Department";
  }
  return (
    <body
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Lato', sans-serif",
        backgroundColor: "#fcfcfc",
        flexDirection: "column"
      }}
    >
      <h1 style={{ marginBottom: "4rem" }}>로그인</h1>
      <Form
        form={form}
        name="login"
        xs={{ span: 10, offset: 2 }}
        lg={{ span: 7, offset: 3 }}
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{ width: "40%" }}
      >
        <Form.Item
          name={"name"}
          rules={[
            {
              required: true,
              message: "Please Input your Username"
            }
          ]}
        >
          <Input
            prefix={<UserOutlined className={"site-form-item-icon"} />}
            placeholder={"@dailyfunding.com"}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!"
            }
          ]}
        >
          <Input
            prefix={<LockOutlined className={"site-form-item-icon"} />}
            type={"password"}
            placeholder={"Password"}
          />
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
            onClick={onClick}
            type={"primary"}
            htmlType={"submit"}
            xs={{ span: 10, offset: 2 }}
            lg={{ span: 6, offset: 2 }}
            className={"login-form-button"}
            style={{ marginTop: "3rem" }}
            block
          >
            register now!
          </Button>
        </Form.Item>
      </Form>
    </body>
  );
};
export default Login;