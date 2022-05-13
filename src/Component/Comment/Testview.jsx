import Comment from "./comment";
import React, { useEffect, useState } from "react";
import Axios from "axios";
const Testview = (props) => {
	//const IssueId = props.match.params.videoId;
	const IssueId =1;
	const [Comments, setComments] = useState([]);
	useEffect(() => {
		Axios
			.get(`http://localhost:3000/comment/`)
			.then((response) => {
				setComments(response.data);
				console.log(response.data);
				}	
			)
	},[])
	const refreshFunction = (newComment) => {
	// 자식컴포넌트에서 버튼을 클릭하면 자식에서 받아온 comment정보(새 댓글)를 newComment라고 한다.
	setComments(Comments.concat(newComment));
	// Comments(댓글)가 담긴 배열에 자식에서 받아온 newComment(새 댓글)를 추가한다.
	
};
	return (
		<>
			<div style={{ padding: "0.5rem 0rem" }}>
			<Comment
				refreshFunction={refreshFunction}
				commentLists={Comments}
				IssueId={IssueId}
				/>
			</div>
		</>
	)
}
export default Testview;