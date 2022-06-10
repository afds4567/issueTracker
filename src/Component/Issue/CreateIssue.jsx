import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil";
import axios from 'axios';
// import MainHeader from "../header";
import styled from "styled-components";
import { BellTwoTone} from '@ant-design/icons';
import { Layout ,Avatar, Tag, Input,Form, DatePicker, Select,Button} from 'antd';
import SingleImageUploadComponent from "./upload";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { getResponsibility } from "../Comment/userFetch";
import { aprojectid } from "../../Recoil/atoms";
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

const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;
// const CategoryData = ['프론트엔드', '백엔드'];
// const OwnerData = {
//   프론트엔드: ['하지원', 'Gangnam', 'Wenzhou'],
//   백엔드: ['오재현', 'Donghae', 'Zhenjiang'],
// };
const Priority = ['긴급', '보통', '여유'];
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
	const { projectId } = useParams();
	const navigate = useNavigate();
	 const [currentpid, setProjectid] = useRecoilState(aprojectid);
	useEffect(() => {
		(async () => {
      console.log(currentpid)
      setProjectid(projectId);
      if (projectId == 'undefined' || currentpid < 1 && projectId < 1) {
        window.alert("프로젝트를 선택해주세요");
        navigate("/project");
      }  
    })();
		async function fetchAndSetUser() { 
			const [category, owner] = await getResponsibility();
			console.log(category, owner);
			if (localStorage.getItem('user')) {
				let temp = JSON.parse(localStorage.getItem('user'));
				const writer = (temp.user_id);
				setReporter(writer);
			}
			await setCategoryData(category);
			await setOwnerData(owner);
			await setFirstCity(category[0]);
			await setSecondCity(owner[firstCity])
			await setCities(OwnerData[firstCity]);
		}
		async function fetchboard() {
			const { data } = await axios.get(`https://6007-221-148-180-175.ngrok.io/project/${projectId}/board`);
			console.log("board",data)
			const tar = (data.find(item => item.order == 1));
			setBoardid(tar.board_id);
		}
   fetchAndSetUser(); 
		fetchboard();
},[]);
	const [reporter,setReporter] = useState('');
	const [CategoryData, setCategoryData] = useState([]);
	const [title, setTitle] = useState("");
	const [boardid, setBoardid] = useState(0);
	const [content, setContent] = useState("");
	const [date, setDate] = useState("");
	const [attach, setAttach] = useState([]);
	const [OwnerData, setOwnerData] = useState({});
  const [firstCity, setFirstCity] = useState(CategoryData[0]);
	const [cities, setCities] = useState(OwnerData[CategoryData[0]]);
	const [secondCity, setSecondCity] = useState(null);
	const [priorities, setPriorities] = useState(Priority);
	const [priority, setPriority] = useState(priorities[0]);
	//const [descript, setDescript] = useState("");
	const [subscribe, setSubscribe] = useState(false);
  const onChange = e => {
		//console.log('Change:', e.target.value);
		setTitle(e.target.value);
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
		setDate(dateString);
	}
	const handleButton = () => {
		setSubscribe(!subscribe);
	}
	const upload = (e) => {
		e.preventDefault();
		let dataforms = new FormData();
		dataforms.append("reporter", reporter);
		dataforms.append("board", boardid);
		dataforms.append("responsibleIssue", firstCity);
		dataforms.append("assignee[0]user", secondCity);
		dataforms.append("deadline", date);
		dataforms.append("title", title);
		// axios.post(`https://6007-221-148-180-175.ngrok.io/issue/`, dataforms)
		// //   .then(res => console.log("응답",...res));
		var t = "";
		if (priority === "긴급") {
			t = "F";
		} else if (priority === "보통") {
			t = "M";
		}
		else if (priority === "여유") {
			t = "S";
		}
		dataforms.append("priority", t);
		dataforms.append("content", content);
		for (let index = 0; index < attach.length; index++) {
			console.log(attach[index]);
			dataforms.append("image", attach[index]);
		}
		dataforms.forEach((value, key) => {
			console.log("key %s: value %s", key, value);
			
		});
		
		axios.post(`https://6007-221-148-180-175.ngrok.io/issue/`, dataforms)
			.then(res => {
				axios.post('https://6007-221-148-180-175.ngrok.io/slack/dm', { username: secondCity, state: "이슈를 할당했습니다" })
					.then(res => res.status == 200 ? navigate(-1) : window.alert("dm 전송 실패"))
					.catch((e) => { window.alert(e) });
			})
			.catch((e) => {
				window.alert(e);
			})
		console.log(dataforms);
  }
		return (
			<>
				{/* <MainHeader /> */}
			
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
								placeholder="<p>Hello from CKEditor 5!</p>"
								onReady={ editor => {
									// You can store the "editor" and use when it is needed.
									console.log('Editor is ready to use!', editor);
									editor.editing.view.change( writer => {
									writer.setStyle( 'height', '200px', editor.editing.view.document.getRoot());
									});
									}
								}
								onChange={ ( event, editor ) => {
									//const data = editor.getData();
									//console.log({ event, editor, data });
								}}
									onBlur={(event, editor) => {
									const data = editor.getData();
									console.log('Blur.', { event, editor, data });
									setContent(data);
								}}
								onFocus={ ( event, editor ) => {
										console.log( 'Focus.', editor );
								}}
							/>
						</Styledmention>
						<SingleImageUploadComponent setAttach={setAttach} />
							
							{/*조건부 렌더링 <Testview /> */}
						</StyledContent>
					
						<StyledSider>
							<SiderWrapper>
								<SiderItemWrapper>
									<StyledItem>
										<div>카테고리</div>
										<Select defaultValue={firstCity} onChange={handleProvinceChange} >
											{CategoryData.map(province => (
												<Option key={province}>{province}</Option>
											))}
										</Select>
									</StyledItem>

									<StyledItem >
										<div>담당자</div>
										<Select defaultValue={secondCity} onChange={onSecondCityChange}>
											{cities && cities.map((city,i) => (
												<Option key={city[1]}>{`${city[0]}`} {i==0?'(팀장)':' '} </Option>
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
									<SelectButton onClick={upload} >
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