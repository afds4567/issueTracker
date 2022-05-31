import React, { useState } from 'react'
import { Mentions,Input  } from 'antd';
import {  useRecoilValue } from 'recoil';
import Axios from "axios";
import SingleComment from "./SingleComment";
import ReplyComment from './ReplyComment';
import { _user } from '../../Recoil/atoms';
import styled from 'styled-components';
const SelectButton = styled.button`
  padding: 6px 25px;
	width:auto;
  background-color: ${(props) => props.color || "#4cd137"};
  border-radius: 4px;
  color: white;
  cursor: pointer;
	margin-top:2rem;
`;
function Comment(props) {
  const user = useRecoilValue(_user); 
  const IssueId = props.IssueId;
  const { Option, getMentions } = Mentions;
  const { TextArea } = Input;
  const [commentValue, setCommentValue] = useState("");
  const [OpenReply, setOpenReply] = useState(false);
  const onClickReplyOpen = () => {
		setOpenReply(!OpenReply);
	};
  const handleClick = (event) => {
    console.log(event);
    setCommentValue(event);
  };
  const checkMention = async (_, value) => {
    const mentions = getMentions(value);
    console.log(mentions);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    checkMention(event, commentValue);
    const variables = {
    comment_content: commentValue,
    writer: user.name,
    issue: IssueId,
    };
    console.log(IssueId)
    Axios.post(`https://6007-221-148-180-175.ngrok.io/comment/`, variables)
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          props.refreshFunction(response.data);
        // 부모컴포넌트에 DB에 저장된 댓글정보를 전달해줌
          setCommentValue("");
        } else {
          alert("코멘트를 저장하지 못했습니다.");
        }
      });
    };   
    return (
      <div>
        <br />
        {/* <p>Replies</p> */}
        <SelectButton onClick={onClickReplyOpen} key="comment-basic-reply-to">
			    댓글 펼치기
		    </SelectButton>
        <hr />
      {/* Comment Lists */}
      {OpenReply&&props.commentLists && props.commentLists.map((comment, index) => (
        (!comment.parent &&
          <>
            <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={IssueId} />
            <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment.comment_id} postId={IssueId} commentLists={props.commentLists}/>
          </>
      )))}
           
      {/* Root Comment Form */}

        <form style={{ display: 'flex' }} onSubmit={onSubmit}>
          
        {/* <textarea
          style={{ width: '100%', borderRadius: '5px' }}
          //onChange={handleClick}
          //value={commentValue}
          placeholder="코멘트를 작성해 주세요"
          > */}
          <Mentions rows={1} style={{ minHeight: '53px', width: '100%', borderRadius: '5px' }}
            
          onChange={handleClick}
          value={commentValue}
            placeholder="코멘트를 작성해 주세요">
            <TextArea style={{ resize: 'none' }} rows={3} >
          <Option value="afc163">afc163</Option>
          <Option value="zombieJ">zombieJ</Option>
              <Option value="yesmeck">yesmeck</Option>
              </TextArea>
            </Mentions>  
          
        <br />
        <SelectButton style={{ width: '20%', height: 'auto' }} onClick={onSubmit}>
          Submit
        </SelectButton>
      </form>
    </div>
  );
}

export default Comment;