import { Card, Avatar,Button,Modal } from 'antd';
import styled from "styled-components"
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import useAsync from './useAsync';
import React, { useState } from 'react';
import {Link} from "react-router-dom";
import projectCreate from './Createprj';
import CreatePrj from './Createprj';
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
    max-width: 1200px;
    margin: 2rem auto;
    
`
const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
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
async function getUsers() {
  const response = await axios.get(
    'http://localhost:4000/data'
  );
  return response.data;
}
const ProjectSelect = () => {
	const [state, refetch] = useAsync(getUsers, []);
	const { loading, data: users, error } = state
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
	
	return (
		<>
			<Wrapper>
				<Title>프로젝트 선택</Title>
				{/* <Link to="/Project/create"> */}
				<StyledButton onClick={showModal}>프로젝트 추가</StyledButton>
				<Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={[]}>
					<CreatePrj changeModal={changeModal} />
				</Modal>
				{/* </Link> */}
				<Container>
					{users && users.map(user => (
					<StyledCard
					style={{  }}
					key={user.id}
					cover={
					<img
						alt="example"
						src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
						style={{marginBottom: "2rem"}}
					/>
					}
					>
					<Meta
						avatar={<Avatar src={(`https://joeschmoe.io/api/v1/${ user.id }`)} />}
						title={user.title}
						description={user && user.description}
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
