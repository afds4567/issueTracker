import React, { useState } from 'react';
import { Comment, Avatar,} from 'antd';
import { useRecoilValue } from 'recoil';
import { _user } from '../../Recoil/atoms';
import Axios from "axios";

function SingleComment(props) {
	const user = useRecoilValue(_user); 
	const [OpenReply, setOpenReply] = useState(false);
	const [CommentValue, setCommentValue] = useState('');
	const onClickReplyOpen = () => {
		setOpenReply(!OpenReply);
	};
	const onHandleChange = (event) => {
		setCommentValue(event.currentTarget.value);
	};
	const onSubmit = (event) => {
		event.preventDefault();
		const variables = {
			content: CommentValue,
			writer: user.user_id,
			postId: props.postId,
			parent: props.comment.comment_id,
		};
		Axios.post(`https://6007-221-148-180-175.ngrok.io/issue/${props.postId}`, variables)
			.then((response) => { 
				if (response.data) {
					console.log(response.data);
					props.refreshFunction(response.data);
					// 부모컴포넌트에 DB에 저장된 댓글정보를 전달해줌
					setCommentValue("");
					setOpenReply(false);
				} else {
					alert("코멘트를 저장하지 못했습니다.");
				}
			});
	};
	const actions = [
		<span onClick={onClickReplyOpen} key="comment-basic-reply-to">
			Reply to
		</span>,
  ];
	return (
		<div>
			{/* SingleComment */}
			<Comment
				actions={actions}
				author={props.comment.writer}
				avatar={<Avatar  src={(`https://joeschmoe.io/api/v1/${props.comment.comment_id}`)} />}
				content={<p>{props.comment.comment_content}</p>}
			/>
			{OpenReply && <form style={{ display: 'flex' }} onSubmit={onSubmit}>
				<textarea
					style={{ width: '100%', borderRadius: '5px' }}
					onChange={onHandleChange}
					value={CommentValue}
					placeholder="코멘트를 작성해 주세요"
				/>
				<br />
				<button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >
					Submit
				</button>
			</form>}
		</div>
	)
}

export default SingleComment;