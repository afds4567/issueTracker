import React, { useState,useEffect } from 'react';
import getUserInfo from './userFetch'
import { useRecoilValue } from 'recoil';
import { MentionsInput, Mention } from "react-mentions";
import Axios from "axios";
import SingleComment from "./SingleComment";
import ReplyComment from './ReplyComment';
import { _user } from '../../Recoil/atoms';
import styled from 'styled-components';
import useAsync from '../useAsync';
//import './mention-style.css'
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
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  -webkit-box-pack: end;
`;
function Commentcomponent(props) {
  const user = useRecoilValue(_user);
  const IssueId = props.IssueId;
  const [data] = useAsync(() => getUserInfo(), []);
  console.log(data);
  const [state, setState] = useState({
    value: "",
    mentionData: null,
    newtest: "",
    men: "",
  })
  // useEffect(() => {
  //   (async () => {
  //     const tresponse = await getUserInfo();
  //     //const response = tresponse.data;
  //     setData(tresponse);
  //     console.log("check",tresponse);
  //   }
  // )();
  // }, );
  const [comment, setComment] = useState('');
  const [mentionList, setMentionList] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const [OpenReply, setOpenReply] = useState(false);
  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };
  const handleChange = (event, newValue, newPlainTextValue, mentions) => {
    console.log("H", newPlainTextValue, mentions)
    setState({
      value: newValue,
      mentionData: { newPlainTextValue, mentions },
      newtest: newPlainTextValue,
      men: JSON.stringify(mentions.display)
    })
    console.log("new", newPlainTextValue)
    setCommentValue(newPlainTextValue);
  }
  const onAdd = (id, display) => {
    setMentionList({ ...mentionList, display })
    console.log("Comment inside onAdd: ", display);
  }
  const onSubmit = (event) => {
    event.preventDefault();
    console.log(data.data.length);
    //checkMention(event, commentValue);
    let writer = "";
    if (localStorage.getItem('user')) {
      let temp = JSON.parse(localStorage.getItem('user'));
      writer = (temp.user_id);
      console.log(typeof (writer))
    }
    const variables = {
      comment_content: commentValue,
      writer: writer,
      issue: IssueId,
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
        } else {
          alert("코멘트를 저장하지 못했습니다.");
        }
      });
  };
  return (
    <div>
      <br />
      {/* Root Comment Form */}
      {data.data && <div style={{ flexDirection: 'column' }}>
        {data.data?.length && <MentionsInput
          style={{ width: '100%', minHeight: '100px' }}
          //markup="@{{__type__||__id__||__display__}}"
          value={state.value}
          className="mentions"
          onChange={handleChange}
          placeholder="담당자를 추가하려면 @멘션기능을 사용해주세요"
        >
          
          <Mention
            trigger="@"
            data={data.data[0]}
            //renderSuggestion={renderSuggestion}
            onAdd={onAdd}
            className="mentions__mention"
            appendSpaceOnAdd={true}
          />
        </MentionsInput>}
        <br />
        <ButtonWrapper>
          <SelectButton style={{ marginTop: '0' }} onClick={onSubmit}>
            댓글작성
          </SelectButton>
        </ButtonWrapper>
      </div>}
        {/* Comment Lists */}
      <SelectButton onClick={onClickReplyOpen} key="comment-basic-reply-to">
        댓글 펼치기
      </SelectButton>
      <hr />
      {OpenReply && props.commentLists && props.commentLists.map((comment, index) => (
        (!comment.parent &&
          <>
            <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={IssueId} />
            <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment.comment_id} postId={IssueId} commentLists={props.commentLists} />
          </>
        )
      ))}
    </div>
  );
}

export default Commentcomponent;