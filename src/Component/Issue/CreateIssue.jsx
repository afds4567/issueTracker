import React, { useState,useRef } from "react";
import MainHeader from "../header";
import styled from "styled-components";
import QuillEditor from "../editor/QuillEditor";
import { InboxOutlined,BellTwoTone} from '@ant-design/icons';
import { Layout ,Avatar, Tag, Input, Icon,Form, DatePicker, Select,Upload, message,Button} from 'antd';
import Api from "../../network/api";
import Testview from "../Comment/Testview";
// const { TextArea } = Input;
const { Dragger } = Upload;
const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;

const CategoryData = ['프론트엔드', '백엔드'];
const OwnerData = {
  프론트엔드: ['하지원', 'Gangnam', 'Wenzhou'],
  백엔드: ['오재현', 'Donghae', 'Zhenjiang'],
};
const Priority = ['긴급', '보통', '낮음'];

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
const CreateIssue = () => {
	const [form] = Form.useForm();
  const [firstCity, setFirstCity] = useState("Seoul");
	const [cities, setCities] = useState(OwnerData[CategoryData[0]]);
	const [secondCity, setSecondCity] = useState(OwnerData[CategoryData[0]][0]);
	const [priorities, setPriorities] = useState(Priority);
	const [priority, setPriority] = useState(priorities[0]);
	const [descript, setDescript] = useState("");
	const [subscribe, setSubscribe] = useState(false);
	const [htmlContent, setHtmlContent] = useState("");
	 const quillRef = useRef();
  const onChange = e => {
  console.log('Change:', e.target.value);
	};
	const handleProvinceChange = value => {
    //console.log(value);
    setFirstCity(value);
    setCities(OwnerData[value]);
    setSecondCity(OwnerData[value][0]);
	};
	const onSecondCityChange = value => {
			setSecondCity(value);
	};
	const onPriorityChange = value => {
		setPriority(value);
	};
	const onDate=(date, dateString)=> {
  	console.log(date, dateString);
	}
	const handleButton = () => {
		setSubscribe(!subscribe);
	}
	const props = {
  name: 'file',
  multiple: true,
  action: 'http://localhost:5555/uploads',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  	},
	};
	const api = new Api();
  return (
		<>
			<MainHeader />
			
			<StyledLayout >
				<StyledHeader/>
				<Layout>
					<StyledContent>
						<WriterWrapper><div style={{ fontWeight: "bold" }}>Created by</div><Avatar style={{ padding: "3px", marginLeft: "10px" }} src="https://joeschmoe.io/api/v1/random" /> 하지원</WriterWrapper>
						
						<Input showCount maxLength={20} onChange={onChange} placeholder={"요약"} />
						
						<QuillEditor quillRef={quillRef} htmlContent={htmlContent} setHtmlContent={setHtmlContent} api={api} />
						
						<div style={{marginTop:'3rem'}}>첨부파일
							<Dragger {...props} >
								<p className="ant-upload-drag-icon">
									<InboxOutlined />
								</p>
								<p className="ant-upload-text">Click or drag file to this area to upload</p>
								<p className="ant-upload-hint">
									Support for a single or bulk upload. Strictly prohibit from uploading company data or other
									band files
								</p>
							</Dragger>
						</div>
						<Testview/>
					</StyledContent>
					
					<StyledSider>
						<SiderWrapper>
							<SiderItemWrapper>
								<StyledItem>
									<div>카테고리</div>
									<Select defaultValue={CategoryData[0]} onChange={handleProvinceChange} >
										{CategoryData.map(province => (
										<Option key={province}>{province}</Option>
										))}
									</Select>
								</StyledItem>

								<StyledItem >
									<div>담당자</div>
									<Select value={secondCity} onChange={onSecondCityChange}>
										{cities.map(city => (
										<Option key={city}>{city}</Option>
									))}
									</Select>
								</StyledItem>
								
								<StyledItem >
									<div>우선순위</div>
									<Select value={priority} onChange={onPriorityChange}>
										{priorities.map(priority => {
											let color = priority ==='보통' ? 'yellow' : 'green';
											if (priority === '긴급') {
												color = 'volcano';
											}
											return(
												<Option key={priority}><Tag color={color}>{priority}</Tag></Option>
											)
									})}
									</Select>
							</StyledItem>
							
							<StyledItem >
									<div>예상 기한</div>
								<DatePicker onChange={onDate} />
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
							<StyledItem style={{marginBottom:'2rem'}}>
								<div style={{display:"flex",alignItems: "center",justifyContent:"space-between"}}>
									<div>구독하기</div>
									{subscribe? <Button onClick={handleButton} shape ="circle" icon={<BellTwoTone twoToneColor="#d3cf53"/> }></Button>: 
									<Button onClick={handleButton} shape ="circle" icon={<BellTwoTone twoToneColor="grey"/> }></Button>}
								</div>
							</StyledItem>
							
								</SiderItemWrapper>
					</SiderWrapper>
					</StyledSider>
        
      </Layout>
				<StyledFooter/>
				</StyledLayout>
				
		</>
  )
}
export default CreateIssue;