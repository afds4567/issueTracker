import React, { useEffect, useState } from "react";
import { Table,Tag } from 'antd';
import { ELoader, Loader } from "./Loader";
import MainHeader from "./header";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ListLayout = styled.div`
  padding: 3rem 8rem;
`

const columns = [
    {
      title: 'id',
      dataIndex: 'issue_id',
      key: 'id',
  },
  {
    title: 'project',
    dataIndex:["board","project","project_name"]
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
          console.log(color)
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
      render: (assignee) => { const ans = assignee.filter(a => a.mension === false).map(a => a.user + " "); console.log(ans); return ans },
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
  const onChangeHandler = (page, pageSize, filters, sorter) => {
  setCurrent(page);
  };
  useEffect(() => {
    const fetchData = async () => {
			try {
				setError(null);
				setData(null);
				setLoading(true);
				const response = await axios.get(
					`https://6007-221-148-180-175.ngrok.io/MyIssue`
        ).then(res => { if (res.data < 1) { window.alert("해당하는 이슈가 없습니다."); } setData(res.data);});
			} catch (e) {
        console.log(e);
        setError(e);
			}
      setLoading(false);
      console.log(data);
    };
    fetchData();
  }, [])
  if (loading) return <Loader/> ;
  if (error) return <ELoader/>;
  return (
    <>
      {
        !data ?
        <Loader/> :
        <>
          <MainHeader />
          <ListLayout>
            <h1>내 이슈</h1>
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