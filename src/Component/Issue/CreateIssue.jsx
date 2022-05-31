import React, { useState,useRef } from "react";
import MainHeader from "../header";
import styled from "styled-components";
import { BellTwoTone,InboxOutlined} from '@ant-design/icons';
import { Layout ,Avatar, Tag, Input,Form, DatePicker, Select, message,Button} from 'antd';
import Testview from "../Comment/Testview";
import SingleImageUploadComponent from "./upload";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
//import Mention from '@ckeditor/ckeditor5-mention/src/mention';
function customItemRenderer( item ) {
  const itemElement = document.createElement( 'span' );
	const avatar = document.createElement( 'img' );
	const userNameElement = document.createElement( 'span' );
	const fullNameElement = document.createElement( 'span' );
		//itemElement.flexwrap
	itemElement.classList.add( 'mention__item' );
	// Avatar style={{ padding: "3px", marginLeft: "10px" }} src="https://joeschmoe.io/api/v1/random"
  avatar.src = `https://joeschmoe.io/api/v1/${ item.avatar }`;
	avatar.style.height = "25px";
	avatar.style.width = "25px";
	avatar.style.marginRight = "10px";
	//avatar.style={ padding: "3px", marginLeft: "10px" }
  userNameElement.classList.add( 'mention__item__user-name' );
  userNameElement.textContent = item.id;

  fullNameElement.classList.add( 'mention__item__full-name' );
  fullNameElement.textContent = item.name;

  itemElement.appendChild( avatar );
  itemElement.appendChild( userNameElement );
    //itemElement.appendChild( fullNameElement );
	itemElement.style.width = "auto";
    return itemElement;
}
const editorConfiguration = {
	extraPlugins: [ 'Mention'],
	toolbar: [ 'bold', 'italic','|','outdent',	'indent','|','undo','redo','bulletedList',],
	mention: {
		feeds: [
			{
				language: 'kr',
				marker: '@',
				feed: [
					{ id: '@하지원', avatar: '1', name: '지원' },
					{ id: '@gjackson', avatar: '2', name: 'Gerald Jackson' },
					{ id: '@wreed', avatar: '3', name: 'Wayne Reed' },
					{ id: '@lgarcia', avatar: '4', name: 'Louis Garcia' },
					{ id: '@rwilson', avatar: '5', name: 'Roy Wilson' },
					{ id: '@mnelson', avatar: 'm_6', name: 'Matthew Nelson' },
					{ id: '@rwilliams', avatar: 'm_7', name: 'Randy Williams' },
					{ id: '@ajohnson', avatar: 'm_8', name: 'Albert Johnson' },
					{ id: '@sroberts', avatar: 'm_9', name: 'Steve Roberts' },
					{ id: '@kevans', avatar: 'm_10', name: 'Kevin Evans' },
					{ id: '@mwilson', avatar: 'w_1', name: 'Mildred Wilson' },
					{ id: '@mnelson', avatar: 'w_2', name: 'Melissa Nelson' },
					{ id: '@kallen', avatar: 'w_3', name: 'Kathleen Allen' },
					{ id: '@myoung', avatar: 'w_4', name: 'Mary Young' },
					{ id: '@arogers', avatar: 'w_5', name: 'Ashley Rogers' },
					{ id: '@dgriffin', avatar: 'w_6', name: 'Debra Griffin' },
					{ id: '@dwilliams', avatar: 'w_7', name: 'Denise Williams' },
					{ id: '@ajames', avatar: 'w_8', name: 'Amy James' },
					{ id: '@randerson', avatar: 'w_9', name: 'Ruby Anderson' },
					{ id: '@wlee', avatar: 'w_10', name: 'Wanda Lee' }
				],
				itemRenderer: customItemRenderer
			},
		]
	}
};

// const { TextArea } = Input;
//const { Dragger } = Upload;
const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;

const CategoryData = ['프론트엔드', '백엔드'];
const OwnerData = {
  프론트엔드: ['하지원', 'Gangnam', 'Wenzhou'],
  백엔드: ['오재현', 'Donghae', 'Zhenjiang'],
};
const Priority = ['긴급', '보통', '낮음'];
const Styledmention = styled.div`
	.ck.ck-list__item {
		> li {
			cursor: default;
			min-width: 9em;
		}
	}
`
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
const StyledCkeditor = styled(CKEditor)`
	& .ck-editor__editable:not(.ck-editor__nested-editable) {
    border-radius: 0;
    height: 900px;
}
`
const SelectButton = styled.button`
  padding: 6px 25px;
	width:100%;
  background-color: ${(props) => props.color || "#4cd137"};
  border-radius: 4px;
  color: white;
  cursor: pointer;
	margin-top:2rem;
`;

const CreateIssue = () => {
	//const [form] = Form.useForm();
  const [firstCity, setFirstCity] = useState("Seoul");
	const [cities, setCities] = useState(OwnerData[CategoryData[0]]);
	const [secondCity, setSecondCity] = useState(OwnerData[CategoryData[0]][0]);
	const [priorities, setPriorities] = useState(Priority);
	const [priority, setPriority] = useState(priorities[0]);
	//const [descript, setDescript] = useState("");
	const [subscribe, setSubscribe] = useState(false);
  const onChange = e => {
  console.log('Change:', e.target.value);
	};
	const handleProvinceChange = value => {
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

		return (
			<>
				<MainHeader />
			
				<StyledLayout >
					<StyledHeader />
					<Layout>
						<StyledContent>
							<WriterWrapper><div style={{ fontWeight: "bold" }}>Created by</div><Avatar style={{ padding: "3px", marginLeft: "10px" }} src="https://joeschmoe.io/api/v1/random" /> 하지원</WriterWrapper>
						
							<Input showCount maxLength={20} onChange={onChange} placeholder={"요약"} />
							<Styledmention>
							<StyledCkeditor
                    editor={ Editor }
                    config={ editorConfiguration }
                    data="<p>Hello from CKEditor 5!</p>"
                    onReady={ editor => {
                      // You can store the "editor" and use when it is needed.
											console.log('Editor is ready to use!', editor);
											editor.editing.view.change( writer => {
    									writer.setStyle( 'height', '200px', editor.editing.view.document.getRoot());
											});
											}
										}
                    onChange={ ( event, editor ) => {
                      const data = editor.getData();
											console.log({ event, editor, data });
                    }}
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    }}
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    }}
                />
							</Styledmention>
							<SingleImageUploadComponent />
						
							{/*조건부 렌더링 <Testview /> */}
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
												let color = priority === '보통' ? 'yellow' : 'green';
												if (priority === '긴급') {
													color = 'volcano';
												}
												return (
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
									<StyledItem style={{ marginBottom: '2rem' }}>
										<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
											<div>구독하기</div>
											{subscribe ? <Button onClick={handleButton} shape="circle" icon={<BellTwoTone twoToneColor="#d3cf53" />}></Button> :
												<Button onClick={handleButton} shape="circle" icon={<BellTwoTone twoToneColor="grey" />}></Button>}
										</div>
									</StyledItem>
									
								</SiderItemWrapper>
									<SelectButton >
        이슈 등록
      </SelectButton>
							</SiderWrapper>
							
						</StyledSider>
        
					</Layout>
					<StyledFooter />
				</StyledLayout>
				
			</>
		)
	}

export default CreateIssue;