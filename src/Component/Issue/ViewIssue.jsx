import React, { useEffect,useState,memo } from "react";
import styled from "styled-components";
import AsteroidLoadingSpinner from 'asteroid-loading-spinner'
import { BellTwoTone} from '@ant-design/icons';
import { Layout ,Avatar,Form, Select,Button} from 'antd';
import Testview from "../Comment/Testview";
import { useParams } from "react-router-dom";
import axios from "axios";
// import MainHeader from "../header";
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
	border-radius:5px;
	height:auto;
	border:1px solid #d9d9d9;
	background-color: rgb(242 242 242 / 25%);
`
const StyledFooter = styled(Footer)`
	padding: 2rem 8rem;
	line-height: 3rem;
	height : 3rem;
`
const ImageLink = styled.div`
	cursor: pointer;
	marginTop:1rem;
	:hover {
			background-color: #7ec1ff;
	}
`
const SelectButton = styled.button`
  padding: 6px 25px;
	width:100%;
  background-color: ${(props) => props.subscribe ? 'red' : "#4cd137"};
  border-radius: 4px;
  color: white;
  cursor: pointer;
	margin-top:0.5rem;
	margin-bottom:0.5rem;
`;

const ViewIssue = () => {
	const [loading, setLoading] = useState(true);
  const { issueId } = useParams();
	const [data, setData] = useState([]);
	const [Pid, setPid] = useState(0);
	const [name, setName] = useState("");
	const [status, setStatus] = useState([]);
	const [selectStatus, setSelectedStatus] = useState(0);
	const [owner, setOwner] = useState(false);
	const [subscribe, setSubscribe] = useState(false);
	const [assignee, setAsignee] = useState(false);
	const cont = (data.content);
	const attach = data.attachment;
	const onstatusChange = (v) => {
		
		setSelectedStatus(v);
	}
	const handleButton = () => {
		setSubscribe(!subscribe);
		axios.post(`https://6007-221-148-180-175.ngrok.io/subscribe`,{issue:issueId})
	}
	const handleApply = () => {
		axios.patch(`https://6007-221-148-180-175.ngrok.io/issue/${issueId}/`, { board: selectStatus })
			.then((res) => { window.alert("진행 단계가 성공적으로 변경되었습니다"); })
		//axios.get(`https://6007-221-148-180-175.ngrok.io/issue/${issueId}`).then(res=>console.log(res));
		//console.log(res);
		//axios.post(`https://6007-221-148-180-175.ngrok.io/subscribe`,{issue:issueId})
	}
	
	function check(element) {
		console.log(element);
		for (let i = 0; i < element.length; i++){
			console.log(element[i].subscriber, name);
      if (element[i].subscriber ==  name)return true
		}
		return false
  }
  function check2(element) {
		console.log(element);
		for (let i = 0; i < element.length; i++){
			console.log(element[i].user, name);
      if (element[i].user ==  name)return true
		}
		return false
  }
	useEffect(() => {
		if (localStorage.getItem('user')) {
    	const name = JSON.parse(localStorage.getItem('user')).name;
			setName(name);
			console.log(name, data.reporter)
		}
		//axios.get(https://6007-221-148-180-175.ngrok.io/project/1/board)
    axios.get(`https://6007-221-148-180-175.ngrok.io/issue/${issueId}/`)
      .then( (res) => {
				setData(res.data);
				console.log(res.data?.project_id);
				(res.data.reporter == name ? setOwner(true) : setOwner(false))
				console.log("결과값체크", check(res.data.subscribe));
				setSubscribe(check(res.data.subscribe))
				setAsignee(check2(res.data.assignee))
				setPid(res.data?.project_id);
				axios.get(`https://6007-221-148-180-175.ngrok.io/project/${res.data?.project_id}/board`).then((res)=>{setStatus(res.data);})
			}).then(res => {
				console.log("viewissue확인",Pid);
				setLoading(false);
				
			})
      .catch((err) => {
        console.log(err);
			});
		
	}, [data.reporter]);
	
	
	if (loading) return <div style={{ textAlign: 'center' }}><AsteroidLoadingSpinner style={{margin:'auto'}}  /></div>;
	return (
	<>
		{(loading )? <AsteroidLoadingSpinner/>:
    <>
      {/* <MainHeader /> */}
      <StyledLayout >
				<StyledHeader />
				<Layout>
					<StyledContent>
						<div style={{ fontWeight: "bold",display:"flex",justifyContent:"space-between",alignItems:"center",caretColor: "transparent", cursor: "default", height: "50px" }}>
							<div style={{display:"inline", float:"right"}}>{data.title}</div>
							<WriterWrapper style={{float:"left"}}><div style={{ fontWeight: "bold" }}>Created by</div><Avatar style={{ padding: "3px", marginLeft: "10px" }} src="https://joeschmoe.io/api/v1/random" /> {data.reporter}</WriterWrapper>
						</div>
						<div dangerouslySetInnerHTML={ {__html: cont} } style={{paddingTop:"1rem", caretColor: "transparent", cursor:"default", height: "200px", border: "1px solid black" }}></div>
						<div style={{marginTop:"1rem"}}>
							{attach && attach.map((item, index) => { console.log(item.image); return(<ImageLink onClick={() => window.open(item.image, '_blank')}>{`첨부파일${index+1}`}</ImageLink>)})}
						</div>
						<Testview setLoaing={setLoading} /> 
					</StyledContent>
							<StyledSider>
								<SiderWrapper>
									{owner?(assignee?<div><SelectButton onClick={handleApply}>변경 적용</SelectButton></div>:<></>):
									<SelectButton subscribe onClick={handleButton}>{subscribe ? <Button shape="circle" icon={<BellTwoTone twoToneColor="#d3cf53" />}></Button> :
													<Button shape="circle" icon={<BellTwoTone twoToneColor="grey" />}></Button>}
										{subscribe ? `구독취소` : `구독하기`}
									</SelectButton>
									}
								<SiderItemWrapper>
									<StyledItem>
										<div>카테고리</div>
										
									<div>{data.responsibleIssue}</div>
									</StyledItem>

									<StyledItem >
										<div>담당자</div>
										{/* assignee.filter(a => a.mension === false).map(a=>a.user+" "); */}
									<div style={{fontWeight:'bold'}}>{data.assignee?.filter(a => a.mension === false).map(a => a.user + " ")}</div>
									<div>{data.assignee?.filter(a => a.mension === true).map(a => a.user + " ")}</div>
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
											<div>진행 단계</div>
											{assignee ? <Select defaultValue={data.state} onChange={onstatusChange}> 
											{status.map(s => (
												<Option key={s.board_id}>{s.state}</Option>
											))}
										</Select> : <>{data.state}</>}
										
										</StyledItem>
										
									
								</SiderItemWrapper>
									
							</SiderWrapper>
							
						</StyledSider>
				</Layout>
				<StyledFooter />
      </StyledLayout>
      
	</>
	}
  </>)
}
const MemoViewIssue = memo(ViewIssue);
export default MemoViewIssue;