import { Table, Tag, Space, Input,Button } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Highlighter from "react-highlight-words";
import { SearchOutlined } from '@ant-design/icons';
import Header from './header';
import { useRecoilValue,useRecoilState } from 'recoil';
import {isLoggedInRecoil} from '../Recoil/atoms';
import axios from "axios";
import useAsync from './useAsync';
import {aprojectid} from '../Recoil/atoms';
async function getIssue(projectId) {
  const response = await axios.get(
    `https://6007-221-148-180-175.ngrok.io/project/${projectId}`
    //'https://6e54f48d-b34e-497e-bf72-69aaffd4d747.mock.pstmn.io'
  );
  var issues = [];
  console.log(response.data);
  response.data.boards.map((i) => (i.issue.map((j) => { j['status'] = i.title; issues.push(j); })));
  console.log(issues);
  return issues;
}
  
const List = () => {
  const { projectId } = useParams();
  const [top, setTop] = useState('none');
  const [bottom, setBottom] = useState('bottomCenter');
  const [data, setData] = useState([
    // {
    //   issue_id: "",
    //   title: "",
    //   reporter: "",
    //   assignee: "[]",
    //   content: "",
    //   deadline: "",
    //   priority: "",
    //   created_at: "",
    //   updated_at: "",
    //   board: ""
    // }
  ]);
  
  const [currentpid, setProjectid] = useRecoilState(aprojectid);
  const [current, setCurrent] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [states, setState] = useState({ searchText: '', searchedColumn: '' })
  //Table에서 더블클릭시 모달 출력
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeRecord, setActiveRecord] = useState(null);
  const [state] = useAsync(() => getIssue(projectId), []);
  const {loading,data:issue,error} = state;
  const closeModal = () => {
    setIsModalVisible(false);
  };
  //Table에서 검색 기능 
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              searchText(selectedKeys[0]);
              searchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(
          () => searchInput && searchInput.current && searchInput.current.select()
        )
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
    
  function handleReset(clearFilters) {
    clearFilters();
    setState({ searchText: '' });
  };
  //검색 기능 끝

  const onChangeHandler = (page, pageSize, filters, sorter) => {
    setCurrent(page);
  };

  //Table Column 지정
  const columns = [
    {
      title: 'id',
      dataIndex: 'issue_id',
      key: 'id',
    },
    {
      title: '요약',
      dataIndex: 'title',
      key: '요약',
      ...getColumnSearchProps('title'),
    },
    // {
    //   title: '우선순위',
    //   key: 'priority',
    //   dataIndex: 'priority',
    //   filters: [
    //     {
    //       text: '긴급',
    //       value: 'F',
    //     },
    //     {
    //       text: '보통',
    //       value: 'M',
    //     },
    //     {
    //       text: '여유',
    //       value: 'S',
    //     }
    //   ],
    //   onFilter: (value, record) => record.priority.indexOf(value) === 0,
    //   render: (priority) => {
    //     let color = (priority === 'M') ? 'geekblue' : 'green';
    //     if (priority === 'F') {
    //       color = 'volcano';
    //       console.log(color)
    //     }
    //     return (
    //       <Tag color={color} key={priority}>
    //         {priority==='F'?'긴급': (priority==='M'?"보통":"여유")}
    //       </Tag>
    //     )
    //   }
    // },
    {
      title: '기한',
      dataIndex: 'deadline',
      key: 'dday',
      sorter: (a, b) => a.deadline.localeCompare(b.deadline),
      defaultSortOrder: 'descend',
    },
    {
      title: '담당자',
      dataIndex: "assignee",
      render: (assignee) => { const ans = assignee.filter(a => a.mension === false).map(a=>a.user+" "); console.log(ans); return ans },
      key: "assignee"
      
    },
    {
      title: '보고자',
      dataIndex: 'reporter',
      key: '보고자',
    },
    // {
    //   title: '생성일',
    //   dataIndex: '생성일',
    //   key: '생성일',
    //   sorter: (a, b) => a.생성일.localeCompare(b.생성일),
    //   defaultSortOrder: 'descend',
    // },
  ];
  
  const isLoggedIn = useRecoilValue(isLoggedInRecoil);
  const navigate = useNavigate();
  
  useEffect(() => {
    (async () => {
      console.log(currentpid)
      setProjectid(projectId);
    if (!isLoggedIn) {
      //navigate('/login');
      setCurrent(1);
      const response = await getIssue(projectId);
      setData([...response]);
      console.log("check", [...response]);
      
    }})();
  }, [projectId]);
  
  return (
    <> 
      <Header/>
      <div style={{ padding: "3rem 8rem" }}>
        <h1>이슈 리스트</h1>
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
          total={data.length}
          rowKey={record => record.issue_id}
          onRow={(record) => {
            return {
            
            onDoubleClick: () => {
              navigate(`/issue/${record.issue_id}`);
              // setActiveRecord(record);
              // setIsModalVisible(true);
            },
          };
        }}
        />
        {/* <Modal
        title="이슈 디테일"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {/* render whatever you want based on your record */}
        {/* <p>요약: {activeRecord?.요약} </p>
        <p>설명: 에디터툴적용보안 </p>
        <p>카테고리: </p>
        <p>댓글 : antd 멘션 사용 </p>
        <p>담당자: {activeRecord?.담당자}</p>
        <p>보고자: {activeRecord?.보고자}</p>
        <p>진행상태: {activeRecord?.tags} </p>
        <p>우선순위:  </p>
        <p>기한: {activeRecord?.dday} </p>
      //</Modal> */}
      </div>
    </>
  );
}
 

export default List;