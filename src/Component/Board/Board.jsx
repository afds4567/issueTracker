import React,{ useState } from "react";
import Header from "../header";
import { DragDropContext, Droppable} from "react-beautiful-dnd";
import styled from "styled-components";
import Column from "./Column";

const dataset = {
	tasks: {
		"task-1": { id: "task-1", content: "이슈 내용 1" },
		"task-2": { id: "task-2", content: "이슈 내용 2" },
		"task-3": { id: "task-3", content: "이슈 내용 3" },
		"task-4": { id: "task-4", content: "이슈 내용 4" },
		"task-5": { id: "task-5", content: "이슈 내용 5" },
		"task-6": { id: "task-6", content: "이슈 내용 6" },
		"task-7": { id: "task-7", content: "이슈 내용 7" },
		"task-8": { id: "task-8", content: "이슈 내용 8" },
		"task-9": { id: "task-9", content: "이슈 내용 9" },
		"task-10": { id: "task-10", content: "이슈 내용 10" },
		"task-11": { id: "task-11", content: "이슈 내용 11" },
		"task-12": { id: "task-12", content: "이슈 내용 12" }
	},
	columns: {
		"column-1": { id: "column-1", title: "Todo", taskIds: ['task-1'] },
		"column-2": { id: "column-2", title: "In progress", taskIds: ['task-2', 'task-3'] },
		"column-3": { id: "column-3", title: "Review", taskIds: [] },
		"column-4": { id: "column-4", title: "Completed", taskIds: ["task-4"] },

		"column-5": { id: "column-5", title: "Todo", taskIds: ['task-5'] },
		"column-6": { id: "column-6", title: "In progress", taskIds: ['task-6'] },
		"column-7": { id: "column-7", title: "Review", taskIds: ['task-7'] },
		"column-8": { id: "column-8", title: "Completed", taskIds: ["task-8"] },

		"column-9": { id: "column-9", title: "Todo", taskIds: ['task-9'] },
		"column-10": { id: "column-10", title: "In progress", taskIds: ['task-10'] },
		"column-11": { id: "column-11", title: "Review", taskIds: ['task-11'] },
		"column-12": { id: "column-12", title: "Completed", taskIds: ["task-12"] }
	},
	columnOrder: ["column-1", "column-2", "column-3", "column-4"],
	columnOrder2: ["column-5", "column-6", "column-7", "column-8"],
	columnOrder3: ["column-9", "column-10", "column-11", "column-12"]
};
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
    background-color:white;
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
			<div style={{ padding: "0.5rem 8rem" }}>
			<div style={{ display:"flex", margin:"8px"  }}>
				{data.columnOrder.map((id, index) => {
					const column = data.columns[id];
					return <StickyBar>{column.title}</StickyBar>
				 })}
				</div>
			</div>
			<hr/>
			<div style={{ padding: "0rem 8rem" }}>
				<div style={{padding:"1px 16px 1px"}}>1팀</div>
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
				<div style={{padding:"1px 16px 1px"}}>2팀</div>
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