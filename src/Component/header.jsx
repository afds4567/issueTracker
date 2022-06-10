import React, { useState,useEffect,memo} from 'react';
import { RedditOutlined , AppstoreTwoTone, OrderedListOutlined,UserOutlined,PlusCircleTwoTone,FolderOpenTwoTone } from '@ant-design/icons';
import { Menu, Modal } from 'antd';
import styled from 'styled-components';
import Department from './Department';
import { Link,useLocation } from 'react-router-dom';
import { aprojectid } from '../Recoil/atoms';
import { useRecoilValue } from 'recoil';
const HeaderWrapper = styled.div`
  padding: 0 8rem;
	background-color: #fff200;
`

const Header = () => {
	//헤더 메뉴 부분 : 보드, 이슈 리스트, 내 이슈, 이슈 만들기, 마이페이지 
	const [current, setCurrent] = useState("");
	const {pathname} = useLocation();
	// const handleClick = e => {
	// 	console.log('click ', e);
	// };
	const PID = useRecoilValue(aprojectid);
	useEffect(() => {
		setCurrent(pathname.substring(1));
		
	}, [pathname]);
	//모달창 부분
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
		<HeaderWrapper style={{position: "sticky", backgroundColor: "#fff200", top:"0", zIndex:"999"}}>
			<Menu selectedKeys={[current]} mode="horizontal" style={{position: "sticky", backgroundColor: "#fff200", top:"0"}}>
				<Menu.Item key="board" icon={<AppstoreTwoTone />}>
					<Link to={`/board/${PID}`}>
						보드
					</Link>
				</Menu.Item>
				<Menu.Item key="" icon={<OrderedListOutlined />} >
					<Link to={`/project/${PID}`}>
						이슈 리스트
					</Link>
				</Menu.Item>
				<Menu.Item  key="내 이슈" icon={<RedditOutlined />}>
						<Link to= {`/project/MyIssue`}>내 이슈</Link>
				</Menu.Item>
				<Menu.Item key="이슈 만들기" icon={<PlusCircleTwoTone twoToneColor="#eb2f96"/>} >
					<Link to= {`/project/${PID}/create`}>이슈 만들기</Link>
				</Menu.Item>

				<Menu.Item key="프로젝트 선택" icon={<FolderOpenTwoTone twoToneColor="#52c41a"/>} >
					<Link to= "/project">프로젝트 선택</Link>
				</Menu.Item>

				<Menu.Item onClick={showModal} style={{ marginLeft: 'auto' }} key="마이페이지" icon={<UserOutlined />}>
					마이페이지
				</Menu.Item>
					<Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null} >
						<Department modal changeModal={changeModal} />
					</Modal>
			</Menu>
		</HeaderWrapper>
	);
}
const MemoHeader = memo(Header);
export default MemoHeader;