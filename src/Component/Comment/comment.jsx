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
  console.log(data.data);
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
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
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
          // ????????????????????? DB??? ????????? ??????????????? ????????????
          setCommentValue("");
          window.alert("????????? ?????????????????????.");
          setState({ value: "" });
        } else {
          alert("???????????? ???????????? ???????????????.");
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
          placeholder="???????????? ??????????????? @??????????????? ??????????????????"
        >
          
          <Mention
            trigger="@"
            data={[...data.data[0]]}
            //renderSuggestion={renderSuggestion}
            onAdd={onAdd}
            className="mentions__mention"
            appendSpaceOnAdd={true}
          />
        </MentionsInput>}
        <br />
        <ButtonWrapper>
          <SelectButton style={{ marginTop: '0' }} onClick={onSubmit}>
            ????????????
          </SelectButton>
        </ButtonWrapper>
      </div>}
      {/* Comment Lists */}
      <div style={{display:'flex'}}>
      <SelectButton onClick={onClickReplyOpen} key="comment-basic-reply-to">
        ?????? ?????????
      </SelectButton>
      {<div style={{ marginTop:'auto', marginLeft:'1rem', fontSize: '14px',  color: 'gray',bottom:'0px' }} >View {props.commentCnt} more comment (s) </div>    
        }
        </div>
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