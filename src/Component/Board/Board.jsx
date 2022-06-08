import React,{ useState, useEffect } from "react";
import Header from "../header";
import AsteroidLoadingSpinner from 'asteroid-loading-spinner'
import { DragDropContext, Droppable} from "react-beautiful-dnd";
import styled from "styled-components";
import Column from "./Column";
import axios from 'axios';
import { atom, selector, useRecoilValue,useRecoilState } from 'recoil';
import {aprojectid} from '../../Recoil/atoms';
import { useNavigate, useParams } from "react-router-dom";
const Container = styled.div`
  display : flex;
`
const StickyBar = styled.div`
	margin: 8px;
	padding: 8px;
	//border: 1px solid lightgrey;
	font-weight: bold;
	border-radius: 2px;
	width:100%;
	display:flex;
	flex-direction: column;
	background-color:#ea8685;
`
const Board = () => {
	const params = useParams();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [PID, setPID] = useRecoilState(aprojectid);
	const navigate = useNavigate();
	//const PID = useRecoilValue(aprojectid);
	useEffect(() => {
		if (params.projectId < 1 || params.projectId =='undefined') {
			window.alert("프로젝트를 선택해주세요");
			navigate("/project");
		}
		const fetchData = async () => {
			
			try {
				// 요청이 시작 할 때에는 error 와 users 를 초기화하고
				setError(null);
				setData(null);
				// loading 상태를 true 로 바꿉니다.
				setLoading(true);
				console.log(PID);
				console.log(params);
				const response = await axios.get(
					// 'https://6e54f48d-b34e-497e-bf72-69aaffd4d747.mock.pstmn.io/project/1'
					`https://6007-221-148-180-175.ngrok.io/project/${params.projectId}/`
				);
				console.log(response.data.boards);
				setData(response.data.boards); // 데이터는 response.data 안에 들어있습니다.
			} catch (e) {
				setError(e);
			}
			setLoading(false);
		};
		if (PID == 0) { setPID(params.projectId); } ;
		fetchData();
		console.log(PID);
	}, []);

  if (loading) return <div style={{ textAlign: 'center' }}><AsteroidLoadingSpinner style={{margin:'auto'}}  /></div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!data) return null;
	function handleOnDragEnd(result) {
		console.log('result ? ', result);
		const { destination,draggableId, source, type } = result;
		if (!destination) { return };
		if (destination.droppableId === source.droppableId && destination.index === source.index) { return };
		//If dropped inside the same column
		if (destination.droppableId === source.droppableId) {
			//같은 column의 이슈들을 순서대로 배열로 만들어서 다시 넣어준다.
			const newTasks = Array.from(data[destination.droppableId-1].issue);
			//상태 변경 예정인 task를 변수 item에 임시저장
			const item = newTasks[source.index];
			//상태 변경 예정인 task를 삭제
			newTasks.splice(source.index, 1);
			//상태 변경 예정인 task를 새로운 위치에 삽입
      newTasks.splice(destination.index, 0,item);
			//새로운 위치에 있는 task들을 다시 배열로 만들어서 다시 넣어준다.
			const temp = data;
			temp[destination.droppableId-1].issue = newTasks;
			setData([...temp]);
      return;
    }
		//If dropped in a different column
		//Source Column
		const startTasks = Array.from(data[source.droppableId - 1].issue);
		const item = startTasks[source.index];
		startTasks.splice(source.index, 1);
		const temp = data;
		temp[source.droppableId - 1].issue = startTasks;
		//Destination column 
		const finishTasks = Array.from(data[destination.droppableId - 1].issue);
		const destinationBoardId = data[destination.droppableId - 1].board_id;
		finishTasks.splice(destination.index, 0, item);
		temp[destination.droppableId - 1].issue = finishTasks;
		setData([...temp]);
		console.log("도착칼럼", destination.droppableId);
		console.log("item check", item);
		axios.patch(`https://6007-221-148-180-175.ngrok.io/issue/${item.issue_id}/`, { board :destinationBoardId })
		console.log("확인", data);	
	}
	return (
		<>
			<Header />
			<div style={{ padding: "0.5rem 8rem",backgroundColor:"#f7d794" }}>
			<div style={{ display:"flex", margin:"8px"  }}>
				{data.map((id, index) => {
					return <StickyBar key={index}>{id.state}</StickyBar>
				 })}
				</div>
			</div>
			<hr/>
			<div style={{ height:"100vh",backgroundColor:"#ffdd59",padding: "0rem 8rem" }}>
				<div style={{padding:"1px 16px 1px"}}></div>
			<DragDropContext onDragEnd={handleOnDragEnd}>
				<Droppable droppableId="all-columns" direction='horizontal' type='column'>
					{(provided) => (
						<Container
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{data.map((board, index) => {
								const column = board;
								const tasks = board.issue;
								return <Column key={column.id} column={column} tasks={tasks} index={index} />
							})}
							{provided.placeholder}
						</Container>
					)}
				</Droppable>
			</DragDropContext>
			</div>
		</>
	);
};

export default Board;