import React,{ useState } from "react";
import Header from "../header";
import { DragDropContext, Droppable} from "react-beautiful-dnd";
import styled from "styled-components";
import Column from "./Column";

const dataset = {
	tasks: {
		"task-1": { id: "task-1", content: "Content for task 1" },
		"task-2": { id: "task-2", content: "Content for task-2" },
		"task-3": { id: "task-3", content: "Content for task-3" },
		"task-4": { id: "task-4", content: "Content for task-4" }
	},
	columns: {
		"column-1": { id: "column-1", title: "Todo", taskIds: ['task-1'] },
		"column-2": { id: "column-2", title: "In progress", taskIds: ['task-2', 'task-3'] },
		"column-3": { id: "column-3", title: "Review", taskIds: [] },
		"column-4": { id: "column-4", title: "Completed", taskIds: ["task-4"] }
	},
	columnOrder: ["column-1", "column-2", "column-3", "column-4"],
	columnOrder2: ["column-1", "column-2", "column-3"]
};
const Container = styled.div`
    display : flex;
`


const Board = () => {
	const [data, setData] = useState(dataset);

	function handleOnDragEnd(result) {
		console.log('result ? ', result);
		const { destination, source, draggableId, type } = result;
		if (!destination) { return };
		if (destination.droppableId === source.droppableId && destination.index === source.index) { return };
		const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];
		//If dropped inside the same column
		if (start === finish) {
			const newTaskIds = Array.from(start.taskIds);
			newTaskIds.splice(source.index, 1);
			newTaskIds.splice(destination.index, 0, draggableId);
			const newColumn = {
				...start,
				taskIds: newTaskIds
			}
			const newState = {
				...data,
				columns: {
					...data.columns,
					[newColumn.id]: newColumn
				}
			}
			setData(newState)
			return;
		}
		//If dropped in a different column
		const startTaskIds = Array.from(start.taskIds);
		startTaskIds.splice(source.index, 1);
		const newStart = {
			...start,
			taskIds: startTaskIds
		}
		const finishTaskIds = Array.from(finish.taskIds);
		finishTaskIds.splice(destination.index, 0, draggableId);
		const newFinish = {
			...finish,
			taskIds: finishTaskIds
		}
		const newState = {
			...data,
			columns: {
				...data.columns,
				[newStart.id]: newStart,
				[newFinish.id]: newFinish
			}
		}

		setData(newState)
  }
	return (
		<>
			<Header />
			<div style={{ padding: "3rem 8rem" }}>
			<DragDropContext onDragEnd={handleOnDragEnd}>
				<Droppable droppableId="all-columns" direction='horizontal' type='column'>
					{(provided) => (
						<Container
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							
								{data.columnOrder.map((id, index) => {
									const column = data.columns[id];
									const tasks = column.taskIds.map(taskId => data.tasks[taskId])
									return <Column key={column.id} column={column} tasks={tasks} index={index} />
								})}
							{provided.placeholder}
						</Container>
					)}
				</Droppable>
				</DragDropContext>

				<DragDropContext onDragEnd={handleOnDragEnd}>
				<Droppable droppableId="all-columns" direction='horizontal' type='column'>
					{(provided) => (
						<Container
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
								{data.columnOrder2.map((id, index) => {
									const column = data.columns[id];
									const tasks = column.taskIds.map(taskId => data.tasks[taskId])
									return <Column key={column.id} column={column} tasks={tasks} index={index} />

									// <Draggable key={id} draggableId={id} index={index}>
									// 	{(provided) => (
									// 		<li
									// 			ref={provided.innerRef}
									// 			{...provided.dragHandleProps}
									// 			{...provided.draggableProps}
									// 		>
									// 			{title}
									// 		</li>
									// 	)}
									// </Draggable>
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