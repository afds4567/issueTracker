import React, { useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import { useRecoilValue } from 'recoil';
import { _user } from '../../Recoil/atoms';
import Axios from "axios";
const { TextArea } = Input;

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
        writer: user.firstName,
        postId: props.postId,
        responseTo: props.comment.id,
        };
        Axios.post("http://localhost:3001/comment", variables).then((response) => {
            
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
                avatar={<Avatar  src={(`https://joeschmoe.io/api/v1/${props.comment.id}`)} />}
                content={<p>{props.comment.content}</p>}
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