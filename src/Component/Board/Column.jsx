import React from 'react'
import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import Task from './Task';

const Container = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
    width:100%;
    display:flex;
    flex-direction: column;
    background-color:white;
`;
const Title = styled.h3`
    padding: 8px
`;
const TaskList = styled.div`
    padding: 8px;
    background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'inherit')};
    min-height:100px;
`;

export default function Column(props) {
  return (
		<Container>
			<Title>{props.column.title}</Title>
			<Droppable droppableId={props.column.id} type='task'>
				{(provided, snapshot) => (
					<TaskList
						ref={provided.innerRef}
						{...provided.droppableProps}
						isDraggingOver={snapshot.isDraggingOver}
					>
						{props.tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)}
						{provided.placeholder}
					</TaskList>
				)}
			</Droppable>
		</Container>
  )
}
