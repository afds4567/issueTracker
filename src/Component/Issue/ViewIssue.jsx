import React, { useEffect,useState,useRef } from "react";
import MainHeader from "../header";
import styled from "styled-components";
import { InboxOutlined,BellTwoTone} from '@ant-design/icons';
import { Layout ,Avatar, Tag, Input, Icon,Form, DatePicker, Select,Upload, message,Button} from 'antd';
import Api from "../../network/api";
import Testview from "../Comment/Testview";
import SingleImageUploadComponent from "./upload";
import { useParams } from "react-router-dom";
import axios from "axios";
// const { TextArea } = Input;
const { Dragger } = Upload;
const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;


const StyledLayout = styled(Layout)`
	background-color:#f3f3f3;
	height:100vh;
	
	padding: 0rem 8rem;
`
const StyledHeader = styled(Header)`
	padding: 0 8rem;
	line-height: 3rem;
	height : 3rem;
	justify-content: center;
	background-color:#f3f3f3;
`
const WriterWrapper = styled.div`
	display:flex;
	flex-direction:row;
	align-items: center;
	box-sizing:border-box;
	caret-color: transparent;
`
const StyledContent = styled(Content)`
	line-height: 1rem;
	height : 50vh;
	overflow:scroll;
	overflow-x: hidden;
	width: 70%;
	background-color: #fff;
	height:100%;
	padding: 1.5rem  1.5rem;
`
const StyledItem = styled(Form.Item)`
	margin-top: -1rem;
	padding:0 0.5rem;
	margin-top:1rem;
`
const StyledSider = styled(Sider)`
	background: #F3F3F3;
`
const SiderWrapper = styled.div`
	padding: 20px 20px;
	background-color: #FFFFFF;
	height:100%
`
const SiderItemWrapper = styled.div`
	marginTop:2rem;
	borderRadius:5px;
	height:auto;
	border:1px solid #d9d9d9;
	background-color: rgb(242 242 242 / 25%);
`
const StyledFooter = styled(Footer)`
	padding: 2rem 8rem;
	line-height: 3rem;
	height : 3rem;
`
const ViewIssue = () => {
  const { issueId } = useParams();
  const [data,setData] = useState([]);
  useEffect(() => {
    axios.get(`https://6007-221-148-180-175.ngrok.io/issue/${issueId}/`)
      .then( (res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      
      <MainHeader />
      <StyledLayout >
				<StyledHeader />
				<Layout>
						<StyledContent>
        	<WriterWrapper><div style={{ fontWeight: "bold" }}>Created by</div><Avatar style={{ padding: "3px", marginLeft: "10px" }} src="https://joeschmoe.io/api/v1/random" /> {data.reporter}</WriterWrapper>
				{/* <Input value={data.title} style={{caretColor: "transparent", cursor:"none"}} maxLength={20} readOnly={true} placeholder={"요약"} bordered={false}  /> */}
						<h1>이슈 제목 위치: {data.title}</h1>
						<div style={{ caretColor: "transparent", cursor:"none", height: "200px", border: "1px solid black" }}>이슈 내용: {data.content}</div>
						<Testview /> 
					</StyledContent>
					<StyledSider>
							<SiderWrapper>
								<SiderItemWrapper>
									<StyledItem>
										<div>카테고리</div>
										<Select defaultValue={"프론트"} disabled >
											{/* {CategoryData.map(province => (
												<Option key={province}>{province}</Option>
											))} */}
										</Select>
									</StyledItem>

									<StyledItem >
										<div>담당자</div>
										{/* assignee.filter(a => a.mension === false).map(a=>a.user+" "); */}
									<div>{data.assignee?.filter(a => a.mension === false).map(a => a.user + " ")}</div>
									</StyledItem>
							
									<StyledItem >
										<div>우선순위</div>
										<Select disabled defaultValue=
										{data.priority === 'F' ? '긴급' : (data.priority === 'M' ? "보통" : "여유")}
										/>
									</StyledItem>
							
									<StyledItem >
										<div>예상 기한</div>
										{data.deadline}
									</StyledItem>
							
									<StyledItem >
										<div>비슷한 이슈</div>
										<Select
											showSearch
											placeholder="다른 이슈 검색"
											optionFilterProp="children"
											filterOption={(input, option) =>
												option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
											}
										>
											<Option value="jack">Jack</Option>
											<Option value="lucy">Lucy</Option>
											<Option value="tom">Tom</Option>
										</Select>
									</StyledItem>
									<StyledItem style={{ marginBottom: '2rem' }}>
										<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
											<div>구독하기</div>
											{/* {subscribe ? <Button onClick={handleButton} shape="circle" icon={<BellTwoTone twoToneColor="#d3cf53" />}></Button> :
												<Button onClick={handleButton} shape="circle" icon={<BellTwoTone twoToneColor="grey" />}></Button>} */}
										</div>
									</StyledItem>
									
								</SiderItemWrapper>
									{/* <SelectButton >
        이슈 등록
      </SelectButton> */}
							</SiderWrapper>
							
						</StyledSider>
				</Layout>
				<StyledFooter />
      </StyledLayout>
      
    </>
  )
}
export default ViewIssue;