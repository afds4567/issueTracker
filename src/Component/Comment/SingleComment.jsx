import React, { useState } from 'react';
import { Comment, Avatar,} from 'antd';
import { useRecoilValue } from 'recoil';
import { _user } from '../../Recoil/atoms';
import Axios from "axios";
import { MentionsInput, Mention } from "react-mentions";
import styled from 'styled-components';
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  -webkit-box-pack: end;
`;
const SelectButton = styled.button`
  padding: 6px 25px;
  //display: inline-block;
	// width:auto;
  background-color: ${(props) => props.color || "#96F2D7"};
  border-radius: 4px;
  color: white;
  cursor: pointer;
	margin-top:2rem;
  padding:0px 0.25rem;
`;
function SingleComment(props) {
	const user = useRecoilValue(_user); 
	const [OpenReply, setOpenReply] = useState(false);
	const [mentionList, setMentionList] = useState([]);
  const [commentValue, setCommentValue] = useState("");
	const [state, setState] = useState({
		value: "",
		mentionData: null,
		newtest: "",
		men: "",
	});
	const handleChange = (event, newValue, newPlainTextValue, mentions) => {
    console.log("H", newPlainTextValue, mentions)
    setState({
      value: newValue,
      mentionData: { newPlainTextValue, mentions},
      newtest:newPlainTextValue,
      men:JSON.stringify(mentions.display)
    })
		console.log("new", newPlainTextValue)
		setCommentValue(newPlainTextValue);
  }
	const onClickReplyOpen = () => {
		setOpenReply(!OpenReply);
	};
	const onHandleChange = (event) => {
	
	};
	const onAdd =(id, display) => {
    setMentionList({...mentionList,display})
    console.log("Comment inside onAdd: ", display);
  }
	const onSubmit = (event) => {
		event.preventDefault();
		let writer = "";
		 if (localStorage.getItem('user')) {
			let temp = JSON.parse(localStorage.getItem('user'));
			writer = temp.user_id;
		}
		console.log(writer);
		const variables = {
			comment_content: commentValue,
			writer: writer,
			issue: (props.postId),
			parent: props.comment.comment_id,
		};
		
		Axios.post(`https://6007-221-148-180-175.ngrok.io/comment/`, variables)
			.then((response) => { 
				if (response.data) {
					console.log(response.data);
					props.refreshFunction(response.data);
					// 부모컴포넌트에 DB에 저장된 댓글정보를 전달해줌
					setCommentValue("");
					 window.alert("댓글이 작성되었습니다.");
          setState({ value: "" });
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
			{OpenReply && <div style={{ flexDirection: 'column' }}>
				<MentionsInput
					style={{ width: '100%', minHeight: '100px' }}
					markup="@{{__type__||__id__||__display__}}"
					value={state.value}
					className="mentions"
					onChange={handleChange}
					placeholder="Type anything, use the @ symbol to tag other users."
				>
					<Mention
						trigger="@"
						data={[
							{
								id: "1",
								display: "Jimmy"
							},
							{
								id: "2",
								display: "Ketut"
							},
							{
								id: "3",
								display: "Gede"
							}
						]}
						//renderSuggestion={renderSuggestion}
						onAdd={onAdd}
						className="mentions__mention"
						appendSpaceOnAdd={true}
					/>
				</MentionsInput>
				<br />
				<ButtonWrapper>
					<SelectButton style={{ marginTop: '0' }} onClick={onClickReplyOpen}>
						취소
					</SelectButton>
					<SelectButton style={{ marginLeft:'0.5rem',marginTop: '0' }} onClick={onSubmit}>
						댓글작성
					</SelectButton>
				</ButtonWrapper>
			</div>}
		</div>
	)
}

export default SingleComment;



// const [user, setUser] = useRecoilState(_user);
//   if (localStorage.getItem('user')) {
//     let clonedUser = cloneDeep(user);
//     let temp = JSON.parse(localStorage.getItem('user'));
//     clonedUser.name = temp.name;
//     clonedUser.user_id = temp.username;
//     setUser(clonedUser);
//   }