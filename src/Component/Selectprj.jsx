import { Card, Avatar,Button,Modal } from 'antd';
import styled from "styled-components"
import axios from 'axios';
import useAsync from './useAsync';
import React, { useState } from 'react';
import CreatePrj from './Createprj';
import Header from './header';
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
    'https://b87c-221-148-180-175.ngrok.io/project'
  );
  return response.data;
}
const ProjectSelect = () => {
	const [state] = useAsync(getProjects, []);
	const {  data: projects,  } = state
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
	const handleProjectSelect = () => {

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
					{projects && projects.map(user => (
						<StyledCard
						hoverable		
						style={{  }}
						key={user.project_id}
						onClick={handleProjectSelect}	
						cover={
						<img
							alt="example"
							src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
							style={{marginBottom: "2rem"}}
						/>
						}
						>
					<Meta
						avatar={<Avatar src={(`https://joeschmoe.io/api/v1/${ user.project_id }`)} />}
						title={user.project_name}
						description={user && `${user.project_name}팀에 요청하려는 내용을 입력해주세요.`}
					/>
					</StyledCard>
					))}
				</Container>
			</Wrapper>
		</>
	);
};

export default ProjectSelect;
//const { data: quote, loading, error } = useFetch('https://api.quotable.io/random')
