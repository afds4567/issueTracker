import React, { useState } from 'react'
import {  useRecoilValue } from 'recoil';
import { _user } from "../../atom";
import Axios from "axios";
import SingleComment from "./SingleComment";
import ReplyComment from './ReplyComment';

function Comment(props) {
    const user = useRecoilValue(_user); 
    const IssueId = props.IssueId;
    const [commentValue, setCommentValue] = useState("");
    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value);
    };
    const onSubmit = (event) => {
        event.preventDefault();
        const variables = {
        content: commentValue,
        writer: user.firstName,
        postId: IssueId,
        };
        Axios.post("http://localhost:3001/comment", variables).then((response) => {
            
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
            <p>Replies</p>
            <hr />

            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={IssueId} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment.id} postId={IssueId} commentLists={props.commentLists}/>
                    </>
                )))}
           
      {/* Root Comment Form */}

      <form style={{ display: 'flex' }} onSubmit={onSubmit}>
        <textarea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleClick}
          value={commentValue}
          placeholder="코멘트를 작성해 주세요"
        />
        <br />
        <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;