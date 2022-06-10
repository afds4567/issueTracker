import Commentcomponent from "./comment";
import React, { useEffect, useState } from "react";
import {useParams } from 'react-router-dom';
import Axios from "axios";
const Testview = (props) => {
	//const IssueId = props.match.params.videoId;
	const { issueId } = useParams();
	const [Comments, setComments] = useState([]);
	useEffect(() => {
		Axios
			.get(`https://6007-221-148-180-175.ngrok.io/issue/${issueId}`)
			.then((response) => {
				setComments(response.data.comment);
				console.log(response.data.comment);
				//props.setLoading(false);
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
			<Commentcomponent
				refreshFunction={refreshFunction}
				commentLists={Comments}
				IssueId={issueId}
				/>
			</div>
		</>
	)
}
export default Testview;