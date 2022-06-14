import React,{ useState, useEffect,memo } from "react";
import AsteroidLoadingSpinner from 'asteroid-loading-spinner'
import { DragDropContext, Droppable} from "react-beautiful-dnd";
import styled from "styled-components";
import Column from "./Column";
import axios from 'axios';
import {useRecoilState } from 'recoil';
import {aprojectid} from '../../Recoil/atoms';
import { useNavigate, useParams } from "react-router-dom";
const Container = styled.div`
  display : flex;
`
const Board = () => {
	const params = useParams();
	const [autherror, setAutherror] = useState(true);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [PID, setPID] = useRecoilState(aprojectid);
	const navigate = useNavigate();
	useEffect(() => {
		if (params.projectId < 1 || params.projectId =='undefined') {
			window.alert("프로젝트를 선택해주세요");
			navigate("/project");
		}
		const fetchData = async () => {
			try {
				setError(null);
				setData(null);
				setLoading(true);
				const response = await axios.get(
					`https://6007-221-148-180-175.ngrok.io/project/${params.projectId}/`
				);
				setData(response.data.boards); // 데이터는 response.data 안에 들어있습니다.
			} catch (e) {
				setError(e);
			}
			setLoading(false);
		};
		if (PID == 0) { setPID(params.projectId); } ;
		fetchData();
		console.log(PID);
	}, [autherror]);

  if (loading) return <div style={{ textAlign: 'center' }}><AsteroidLoadingSpinner style={{margin:'auto'}}  /></div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!data) return null;
	function handleOnDragEnd(result) {
		console.log('result ? ', result);
		const { destination, source} = result;
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
		axios.patch(`https://6007-221-148-180-175.ngrok.io/issue/${item.issue_id}/`, { board: destinationBoardId })
			.then(res => {
				console.log("res결과",res.status);
			})
			.catch(error => {
				console.log(error);
				window.alert("진행 단계를 변경할 권한이 없습니다!!!!!!!!!!")
				setAutherror(!autherror);
		})
		console.log("확인", data);	
	}
	return (
		<>
			<div style={{ minHeight: "100vh", height: "auto", backgroundColor: "#ffdd59", padding: "3rem 8rem" }}>
				<div style={{ display:"flex",justifyContent:"space-between",margin:"8px"}}>
					<h1>칸반 보드</h1>
				</div>
				<DragDropContext onDragEnd={handleOnDragEnd}>
					<Droppable key={"column" }droppableId="all-columns" direction='horizontal' type='column'>
						{(provided) => (
							<Container
								{...provided.droppableProps}
								ref={provided.innerRef}
							>
								{data.map((board, index) => {
									const column = board;
									const tasks = board.issue;
									return(
									index !== 0 && index !== data.length-1 ? (<Column key={column.id} column={column} tasks={tasks} index={index} ></Column>):<></> )
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
const MeBoard = memo(Board);
export default MeBoard;