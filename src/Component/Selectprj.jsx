import { Card, Avatar,Button,Modal } from 'antd';
import styled from "styled-components"
import axios from 'axios';
import useAsync from './useAsync';
import React, { useState,useEffect } from 'react';
import CreatePrj from './Createprj';
// import Header from './header';
import { Link } from 'react-router-dom';
import AsteroidLoadingSpinner from 'asteroid-loading-spinner'

const { Meta } = Card;
const StyledCard = styled(Card)`
	padding: 1rem;
	// margin: 0.3rem;
`
const StyledButton = styled(Button)`
	float:right;
	margin-top: 1rem;
`
const Wrapper = styled.div`
	// max-width: 1200px;
	// margin: 2rem auto;
	padding: 0 8rem;
`
const Container = styled.div`
  // max-width: 1200px;
  // margin: 2rem auto;
	
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`
const Title = styled.span`
	margin:auto;
	font-size: 2rem;
	font-weight: bold;
	text-align: begin;
	`
//project 정보 가져오는 async 함수
async function getProjects() {
  const response = await axios.get(
    'https://6007-221-148-180-175.ngrok.io/project'
		// 'http://localhost:3000/data'
  );
  return response.data;
}
const ProjectSelect = () => {
	//const [state,fetchData] = useAsync(getProjects, []);
	const [projects, setProjects] = useState([]);
	//const {  data: projects,  } = state
	const [isModalVisible, setIsModalVisible] = useState(false);
	const changeModal = () => {
		setIsModalVisible(false);
	}
	
	const showModal = () => {
    	setIsModalVisible(true);
	};
	const handleOk = () => {
    	setIsModalVisible(false);
	};
	const handleCancel = () => {
    	setIsModalVisible(false);
	};
	const handleProjectSelect = (id) => {
		//setprojectId(id);
	}
	useEffect(() => {
		if (window.localStorage.getItem("token")) {
			const access_token =JSON.parse(window.localStorage.getItem("token")).access_token;
			axios.defaults.headers.common['Authorization'] = "JWT " + access_token;
			const response = axios.get('https://6007-221-148-180-175.ngrok.io/project')
				.then(res => { setProjects(res.data);console.log(res.data) })
			console.log("dat실행")
			//setProjects(response);
			// console.log(response);
			// console.log("selectp", response.data);
		}
		axios.get('https://6007-221-148-180-175.ngrok.io/project')
				.then(res => { setProjects(res.data);console.log(res.data) })
			console.log("dat실행")
	}, [])
	
	return (
		<>
			{projects?.length > 0? <>
			{/* <Header/> */}
			<Wrapper>
				<Title>프로젝트 선택</Title>
				{/* <Link to="/Project/create"> */}
				<StyledButton onClick={showModal}>프로젝트 추가</StyledButton>
				<Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={[]}>
					<CreatePrj changeModal={changeModal} />
				</Modal>
				{/* </Link> */}
				<Container>
					{projects && projects.map((project,i) => (
						<Link to={`/Project/${project.project_id}`} key={project.project_id}>
						<StyledCard
						hoverable		
						style={{  }}
						key={project.project_id}
						onClick={handleProjectSelect(project.project_id)}	
						cover={
						<img
							alt="example"
								src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${10080+i}.png`}
							style={{marginBottom: "2rem"}}
						/>
						}
						>
					<Meta
						avatar={<Avatar src={(`https://joeschmoe.io/api/v1/${ project.project_id }`)} />}
						title={project.project_name}
						description={project && `${project.project_name}팀에 요청하려는 내용을 입력해주세요.`}
					/>
						</StyledCard>
						</Link>
					))}
				</Container>
				</Wrapper>
			</>
			:<div style={{ textAlign: 'center' }}><AsteroidLoadingSpinner style={{margin:'auto'}}  /></div>}
		</>
	);
};

export default ProjectSelect;
//const { data: quote, loading, error } = useFetch('https://api.quotable.io/random')
