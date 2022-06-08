import React, {  useState } from 'react';
import axios from 'axios';
import styled from "styled-components";
const SelectButton = styled.button`
  padding: 6px 25px;
  background-color: ${(props) => props.color || "#fbc531"};
  // background-color:#FF6600;
  border-radius: 4px;
  color: white;
  cursor: pointer;
`;
const SingleImageUploadComponent = (props) => {
  const [file, setFile] = useState([]);
  const [data, setData] = useState([]);
  const hiddenFileInput = React.useRef(null);
  
  const handleClick = event => {
    event.preventDefault();
    hiddenFileInput.current.click();
  };
  function uploadSingleFile(e) {
    setFile([ ...file, URL.createObjectURL(e.target.files[0]) ]);
    setData([...data, (e.target.files[0])]);
    props.setAttach([...data, (e.target.files[0])]);
    console.log('e.target.files[0]', file, e.target.files[0]);
  }

  function upload(e) {
    e.preventDefault();
    let dataforms = new FormData();
    
    dataforms.append("user", 5);
    dataforms.append("board", 1);
    dataforms.append("deadline", "2017-12-12T11:10:00+09:00");
    dataforms.append("title", "제목");
    dataforms.append("content", "내용");
    for (let index = 0; index < data.length; index++) {
      console.log(data[index]);
      dataforms.append("image", data[index]);
    }
    dataforms.forEach((value, key) => {
      console.log("key %s: value %s", key, value);
    });
    // { user:5, board:1, deadline:"2017-12-12T11:10:00+09:00", title: "리액트", content: "내용",dataforms }
    const f = JSON.stringify(data);
    axios.post(`https://682a-221-148-180-175.ngrok.io/issue`, dataforms)
      .then(res => console.log("응답",res));
    console.log(dataforms);
  }

  function deleteFile(e) {
    const s = file.filter((item, index) => index !== e);
    setFile(s);
    console.log(s);
  }
  return (
    <form>
      <div
        style={{
          display: 'grid',
          girdTemplateRows: '1fr 1fr 1fr 1fr',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gridGap: '20px 10px',
        }}
        className="form-group preview"
      >
        {file.length > 0 &&
          file.map((item, index) => {
            return (
              <div
                style={{ display: 'flex', flexDirection: 'column' }}
                key={item}
              >
                <img style={{ width: '100%',height:'100%' }} src={item} alt="" />
                <SelectButton color="#c23616"  onClick={() => deleteFile(index)}>
                  delete
                </SelectButton>
              </div>
            );
          })}
      </div>
      <div style={{ marginTop: '1rem' }}>
       
        {/* <Dragger style={{background:'#fafafa',height: '100%',position: 'relative',
width: '100%',
textAlign: 'center',
border: '1px dashed #d9d9d9',
borderRadius: '2px',
cursor: 'pointer',
transition: 'border-color 0.3s'}} {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </Dragger> */}
      </div>
      <SelectButton onClick={handleClick}>
        파일 선택
      </SelectButton>
      <input
        type="file"
        accept="image/*"
        disabled={file.length === 5}
        ref={hiddenFileInput}
        onChange={uploadSingleFile}
        style={{display: 'none'}}
      />
      

      {/* <Button 
        type="primary"
        shape='round'
        onClick={upload}
      >
        Upload
      </Button> */}
    </form>
  );
};

export default SingleImageUploadComponent;
