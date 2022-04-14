import React, { useState } from 'react';
import { RedditOutlined , AppstoreTwoTone, OrderedListOutlined,UserOutlined,PlusCircleTwoTone } from '@ant-design/icons';
import { Menu, Modal } from 'antd';
import styled from 'styled-components';
import Department from './Department';
import { Route, Link } from 'react-router-dom';

const HeaderWrapper = styled.div`
  padding: 0 8rem;
`
const Header = () => {
    //헤더 메뉴 부분 : 보드, 이슈 리스트, 내 이슈, 이슈 만들기, 마이페이지 
    const [current, setCurrent] = useState("보드");
    const handleClick = e => {
        console.log('click ', e);
        setCurrent(e.key);
    };

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
        <HeaderWrapper>
            <Menu  onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                <Link to= "/board"><Menu.Item key="보드" icon={<AppstoreTwoTone />}>
                보드
                
            </Menu.Item></Link>
            <Menu.Item key="이슈 리스트" icon={<OrderedListOutlined />} >
                이슈 리스트
            </Menu.Item>
            <Menu.Item  key="내 이슈" icon={<RedditOutlined />}>
                {/* <a href="https://ant.design" target="_blank" rel="noopener noreferrer"> */}
                    내 이슈
                {/* </a> */}
            </Menu.Item>
            <Menu.Item key="이슈 만들기" icon={<PlusCircleTwoTone twoToneColor="#eb2f96"/>} >
                이슈 만들기
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
    
export default Header;