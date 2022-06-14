import React from 'react'
import styled from 'styled-components'
import { Droppable,Draggable } from 'react-beautiful-dnd'
import Task from './Task';
const Container = styled.div`
	margin: 8px;
	// border: 1px solid lightgrey;
	border-radius: 2px;
	width:100%;
	display:flex;
	flex-direction: column;
	background-color:white;
`;
const Title = styled.h3`
	font-weight:500;
	padding: 8px;
	margin:auto 0;
`;
const TaskList = styled.div`
	padding: 8px;
	background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'inherit')};
	min-height:100px;
`;

export default function Column(props) {
	return (
		<Draggable draggableId={'b'+String(props.column.board_id)} index={props.index} isDragDisabled={false}>
			{(provided,snapshot)=>(
				<Container {...provided.draggableProps}
										{...provided.dragHandleProps}
					ref={provided.innerRef}
					isDraggingOver={snapshot.isDraggingOver}>
					<div style={{ display:"flex",justifyContent:"space-between",margin:"8px"}}>
						<Title>{props.column.state}</Title>
						{/* <div style={{margin:'auto 0'}}>❌</div> */}
					</div>
					<Droppable droppableId={String(props.column.order)} type='task' >
						{(provided, snapshot) => (
							<TaskList
								ref={provided.innerRef}
								{...provided.droppableProps}
								isDraggingOver={snapshot.isDraggingOver}
							>
								{/* <div style={{fontWeight:'bold'}}>{props.column.state}</div> */}
								{props.tasks.map((task, index) => <Task key={String(task.issue_id)} task={task} index={index} />)}
								{provided.placeholder}
							</TaskList>
						)}
							</Droppable>
							{provided.placeholder}
						</Container>
				)}
			</Draggable>
  )
}
