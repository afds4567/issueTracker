import { Card, Avatar,Button,Modal } from 'antd';
import styled from "styled-components"
import axios from 'axios';
import useAsync from './useAsync';
import React, { useState } from 'react';
import CreatePrj from './Createprj';
import Header from './header';
import { Link } from 'react-router-dom';
import { SetRecoilState } from 'recoil';
import {aprojectid} from '../Recoil/atoms';
import { useRecoilState } from 'recoil';
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
	const [state] = useAsync(getProjects, []);
	const {  data: projects,  } = state
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [projectId, setprojectId] = useRecoilState(aprojectid);
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
	return (
		<>
			<Header/>
			<Wrapper>
				<Title>프로젝트 선택</Title>
				{/* <Link to="/Project/create"> */}
				<StyledButton onClick={showModal}>프로젝트 추가</StyledButton>
				<Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={[]}>
					<CreatePrj changeModal={changeModal} />
				</Modal>
				{/* </Link> */}
				<Container>
					{projects && projects.map(project => (
						<Link to={`/Project/${project.project_id}`} key={project.project_id}>
						<StyledCard
						hoverable		
						style={{  }}
						key={project.project_id}
						onClick={handleProjectSelect(project.project_id)}	
						cover={
						<img
							alt="example"
							src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
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
	);
};

export default ProjectSelect;
//const { data: quote, loading, error } = useFetch('https://api.quotable.io/random')
