import React, { useEffect, useState } from "react";
import { Table,Tag,Breadcrumb  } from 'antd';
import { ELoader, Loader } from "./Loader";
// import MainHeader from "./header";
import "./row.css";
import styled from "styled-components";
import axios from "axios";
import { useNavigate,Link, useParams } from "react-router-dom";
const ListLayout = styled.div`
  padding: 3rem 8rem;
`
const StyledBreadcrumb = styled(Breadcrumb)`
  margin: auto 0;
  margin-left: 1rem;
`
const columns = [
  {
    title: 'id',
    dataIndex: 'issue_id',
    key: 'id',
  },
  {
    title: 'project',
    dataIndex: ["board", "project", "project_name"],
    key:'prj',
    sorter: (a, b) => (a.board.project.project_name.localeCompare(b.board.project.project_name)) ,
  },
    {
      title: '요약',
      dataIndex: 'title',
      key: '요약',
      //...getColumnSearchProps('title'),
    },
    {
      title: '우선순위',
      key: 'priority',
      dataIndex: 'priority',
      filters: [
        {
          text: '긴급',
          value: 'F',
        },
        {
          text: '보통',
          value: 'M',
        },
        {
          text: '여유',
          value: 'S',
        }
      ],
      onFilter: (value, record) => record.priority.indexOf(value) === 0,
      render: (priority) => {
        let color = (priority === 'M') ? 'geekblue' : 'green';
        if (priority === 'F') {
          color = 'volcano';
        }
        return (
          <Tag color={color} key={priority}>
            {priority==='F'?'긴급': (priority==='M'?"보통":"여유")}
          </Tag>
        )
      }
    },
    {
      title: '담당자',
      dataIndex: "assignee",
      render: (assignee) => { const ans = assignee.filter(a => a.mension === false).map(a => a.user + " "); return ans },
      key: "assignee"
      
    },
    {
      title: '보고자',
      dataIndex: 'reporter',
      key: '보고자',
    },
    {
      title: '기한',
      dataIndex: 'deadline',
      key: 'dday',
      sorter: (a, b) => a.deadline.localeCompare(b.deadline),
      defaultSortOrder: 'descend',
  },
    {
    title: '진행상태',
    dataIndex: ["board", "state"],
    key: 'status',
    sorter: (a, b) =>((a.board.order -b.board.order )),
  }
    // {
    //   title: '생성일',
    //   dataIndex: '생성일',
    //   key: '생성일',
    //   sorter: (a, b) => a.생성일.localeCompare(b.생성일),
    //   defaultSortOrder: 'descend',
    // },
  ];  

const MyIssue = () => {
  const [current, setCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const top = 'none';
  const bottom = 'bottomCenter';
  const navigate = useNavigate();
  const { tab } = useParams();
  const user = JSON.parse(localStorage.getItem('user')).name;
  const onChangeHandler = (page, pageSize, filters, sorter) => {
    setCurrent(page);
  };
  function check(element) {
    console.log(user, { tab });
    if ( tab  == undefined) {
      return true;
    }
    else if (tab == 'reporter') {
      if (element.reporter == user ) return true
    }
    else if (tab == 'subscribe') {
      for (let i = 0; i < element.subscribe?.length; i++){
      if (element.subscribe[i].subscriber ==  user)return true
    }
    }
    else if(tab == 'assignee')
    for (let i = 0; i < element.assignee?.length; i++){
      if (element.assignee[i].user ==  user)return true
    }
    return false;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(tab);
				setError(null);
				setData(null);
				setLoading(true);
				await axios.get(
					`https://6007-221-148-180-175.ngrok.io/MyIssue`
        ).then(res => {
          if (res.data < 1) {
            window.alert("해당하는 이슈가 없습니다.");
          }
          console.log(res)
          if (tab == undefined)setData(res.data);
          else setData(res.data.filter(check));
        });
			} catch (e) {
        console.log(e);
        setError(e);
			}
      setLoading(false);
      console.log(data);
    };
    
    fetchData();
  
  }, [tab])
  if (loading) return <Loader/> ;
  if (error) return <ELoader/>;
  return (
    <>
      {
        !data ?
        <Loader/> :
        <>
          {/* <MainHeader /> */}
            <ListLayout>
              <div style={{display:"flex"}}>
              <h1>내 이슈</h1>
              <StyledBreadcrumb>
                <Breadcrumb.Item><Link to={`/project/MyIssue`}>전체 보기</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to={`/project/MyIssue/assignee`}>담당 이슈</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to={`/project/MyIssue/reporter`}>작성 이슈</Link></Breadcrumb.Item>                
                <Breadcrumb.Item><Link to={`/project/MyIssue/subscribe`}>구독 이슈</Link></Breadcrumb.Item>
              </StyledBreadcrumb>
              </div>
              <Table
                style={{border:"1px solid #f0f0f0"}}
                columns={columns}
                pagination={{
                    position: [top, bottom],
                    defaultPageSize: 10,
                    onChange: onChangeHandler,
                    current
                }}
                dataSource={data}
                total={data?.length}
                rowKey={record => record.issue_id}
                rowClassName={(record, index) => (record.board.order===1?'red':(record.board.order>4?'green':null))}
                onRow={(record) => {
                  return {
                    onDoubleClick: () => {
                    navigate(`/issue/${record.issue_id}`);
                  },
                };
              }}
              />
            </ListLayout>
          </>
        }
      </>
  );
};
export default MyIssue;