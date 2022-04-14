import { Table, Tag, Space, Input,Button,Modal } from 'antd';
import { useState, useEffect,useRef } from 'react';
import tableData from '../TableData.json';
import Highlighter from "react-highlight-words";
import { SearchOutlined } from '@ant-design/icons';
import Header from './header';
import styled from 'styled-components';

const topOptions = [
  { label: 'topLeft', value: 'topLeft' },
  { label: 'topCenter', value: 'topCenter' },
  { label: 'topRight', value: 'topRight' },
  { label: 'none', value: 'none' },
];

const bottomOptions = [
  { label: 'bottomLeft', value: 'bottomLeft' },
  { label: 'bottomCenter', value: 'bottomCenter' },
  { label: 'bottomRight', value: 'bottomRight' },
  { label: 'none', value: 'none' },
];

const HeaderWrapper = styled.div`
  padding: 0 8rem;
`



const List = () => {
  const [top, setTop] = useState('none');
  const [bottom, setBottom] = useState('bottomCenter');
  const [data, setData] = useState(tableData);
  const [current, setCurrent] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  //Table에서 더블클릭시 모달 출력
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeRecord, setActiveRecord] = useState(null);
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
      searchedColumn:dataIndex,
    });
  };
    
  function handleReset (clearFilters) {
    clearFilters();
    setState({ searchText: '' });
  };
  //검색 기능 끝

  useEffect(() => {
    setData(tableData);
    setCurrent(1);
  },[] );
  const onChangeHandler = (page,pageSize,filters,sorter) => {
    setCurrent(page);
  };

    //Table Column 지정
  const columns = [
  {
    title: 'id',
    dataIndex: 'key',
    key: 'id',
  },
  {
    title: '요약',
    dataIndex: '요약',
    key: '요약',
     ...getColumnSearchProps('요약'),
    },
  {
    title: '상태',
    key: 'tags',
    dataIndex: 'tags',
    filters: [
    {
      text: '할 일',
      value: '할 일',
    },
    {
      text: '진행중',
      value: '진행중',
      },
    {
      text: '완료됨',
      value: '완료됨',
    }
    ],
    onFilter: (value, record) => record.tags.indexOf(value) === 0,
    render: tags => (
      <span>
        {tags.map(tag => {
          let color = tag ==='진행중' ? 'geekblue' : 'green';
          if (tag === '할 일') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: '기한',
    dataIndex: 'dday',
    key: 'dday',
  },
  {
    title: '담당자',
    dataIndex: '담당자',
    key: '담당자',
  },
    {
    title: '보고자',
    dataIndex: '보고자',
    key: '보고자',
    },
    {
    title: '생성일',
    dataIndex: '생성일',
    key: '생성일',
    sorter: (a, b) => a.생성일.localeCompare(b.생성일),
    defaultSortOrder: 'descend',
  },
  // {
  //   title: 'Action',
  //   key: 'action',
  //   render: (text, record) => (
  //     <Space size="middle">
  //       <a>Invite {record.요약}</a>
  //       <a>Delete</a>
  //     </Space>
  //   ),
  // },
];
  
  return (
    <> 
      <HeaderWrapper>
        <Header/>
      </HeaderWrapper>
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
          onRow={(record) => {
          return {
            onDoubleClick: () => {
              setActiveRecord(record);
              setIsModalVisible(true);
            },
          };
        }}
        />
        <Modal
        title="이슈 디테일"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {/* render whatever you want based on your record */}
        <p>요약: {activeRecord?.요약} </p>
        <p>설명: 에디터툴적용보안 </p>
        <p>카테고리: </p>
        <p>댓글 : antd 멘션 사용 </p>
        <p>담당자: {activeRecord?.담당자}</p>
        <p>보고자: {activeRecord?.보고자}</p>
        <p>진행상태: {activeRecord?.tags} </p>
        <p>우선순위:  </p>
        <p>기한: {activeRecord?.dday} </p>
      </Modal>
      </div>
    </>
  );
}
 

export default List;