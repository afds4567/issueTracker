import React, { useState } from "react";
import MainHeader from "../header";
import styled from "styled-components";
import { InboxOutlined } from '@ant-design/icons';
import { Layout ,Avatar, Tag, Input, Icon,Form, DatePicker, Select,Upload, message} from 'antd';
const { TextArea } = Input;
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
  	background-color:grey;
`
const StyledHeader = styled(Header)`
	padding: 0 8rem;
	line-height: 3rem;
	height : 3rem;
	align-items: center;
	justify-content: center;
	background-color:#f3f3f3;
`
const StyledContent = styled(Content)`
	padding-left: 8rem;
	line-height: 3rem;
	height : 3rem;
	width: 70%
`
const StyledItem = styled(Form.Item)`
	margin-bottom: 0;
	padding:0 12px;
	margin-top:1rem;
`
	

const StyledSider = styled(Sider)`
	padding-right: 8rem;
	line-height: 3rem;
	height : 3rem;
	width: 30%;
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
	const [descript, setDescript] =useState("");
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
  return (
		<>
			<MainHeader />
			
			<StyledLayout >
				<StyledHeader>
					<span style={{ paddingLeft: '20px' }}>작성자:</span> <Avatar src="https://joeschmoe.io/api/v1/random" /> 하지원
				</StyledHeader>
				{/* <Layout>
					<StyledContent>
						<div>요약</div> 
						<StyledInput showCount maxLength={20} onChange={onChange} />
					</StyledContent>
					<StyledSider>Sider<StyledInput showCount maxLength={20} onChange={onChange} /></StyledSider>
				</Layout> */}

				<Layout style={{ background: '#f3f3f3',padding: '0 8rem'}}>
					<StyledContent style={{background: '#fff', minHeight: '70vh', padding: '0px 20px'}}>
							<div>요약</div>
							<Input showCount maxLength={20} onChange={onChange} />

							<TextArea
								value={descript}
								onChange={onChange}
								placeholder="Controlled autosize"
								autoSize={{ minRows: 3, maxRows: 5 }}
        			/>
							<Dragger style={{height: "20px"}} >
								<p className="ant-upload-drag-icon">
									<InboxOutlined />
								</p>
								<p className="ant-upload-text">Click or drag file to this area to upload</p>
								<p className="ant-upload-hint">
									Support for a single or bulk upload. Strictly prohibit from uploading company data or other
									band files
								</p>
							</Dragger>
					</StyledContent>
					
					<Sider style={{ background: '#F3F3F3',}}>
							<div style={{ padding: '12px 20px', backgroundColor: '#FFFFFF',height:'100%' }}>
								<div style={{ borderRadius:'5px', border:'1px solid #d9d9d9',backgroundColor: 'rgb(242 242 242 / 25%)',height:'100%'}}>
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
									</div>
						</div>
					</Sider>
        
      </Layout>
				<StyledFooter style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</StyledFooter>
				</StyledLayout>
				
		</>
  )
}
export default CreateIssue;