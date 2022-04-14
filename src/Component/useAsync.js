import { useReducer, useEffect } from 'react';


function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null
      };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function useAsync(callback, deps = []) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: false
  });

  const fetchData = async () => {
    dispatch({ type: 'LOADING' }); //loading 상태 시작
    //이 부분부터는 loading상태이기 때문에 여기서 loading시 실행할 함수 실행  
    try {
      const data = await callback();
			//이 부분에서 함수를 실행하면 서버로부터 데이터를 잘 받아온 경우에 실행 (state 성공상태 변경 이전)
			dispatch({ type: 'SUCCESS', data });
			//이 부분에서 함수를 실행하면 서버로부터 데이터를 잘 받아온 경우에 실행 (state 성공상태 변경 이후)
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint 설정을 다음 줄에서만 비활성화
    // eslint-disable-next-line
  }, deps);

  return [state, fetchData];
}

export default useAsync;

