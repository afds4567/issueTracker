import React from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
import axios from 'axios';
const Container = styled.div`
    border: 1px solid lightgrey;
    padding:8px;
    margin-bottom:8px;
    border-radius:2px;
    background-color:${props => (props.isDragging ? '#ffc048' : '#ff5e57')};
`
function Task(props) {
 	React.useEffect(() => {
		const postData = async () => {
			try {
				// const response = await axios.patch(
				// 	'https://682a-221-148-180-175.ngrok.io/project/1/', { board :data }
				// );
				console.log(props.task.board)
				console.log("task", props.task);
				//console.log(data);
				console.log("post data success");
			} catch (e) {
				console.log(e);
			}
		}
		postData();
	}, [props.task.board]);
    
    return (
        <Draggable draggableId={String(props.task.issue_id)} index={props.index} isDragDisabled={false}>
            {(provided, snapshot) => (
                <Container
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                <div style={{ display:"flex",justifyContent:"space-between",margin:"8px"}}>
                        <div>{props.task.title}</div>
                        
                </div>
                </Container>
            )}
        </Draggable>
    )
}

export default Task