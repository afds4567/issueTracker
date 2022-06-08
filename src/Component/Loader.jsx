import AsteroidLoadingSpinner from 'asteroid-loading-spinner'
const Loader = () => {
  return (<div style={{ textAlign: 'center' }}><AsteroidLoadingSpinner style={{ margin: 'auto' }} /></div>);
}

function ELoader ()  {
  return ( <div style={{ textAlign: 'center' }}><div style={{ margin: 'auto' }} >에러가 발생했습니다. 개발팀에 문의하세요.</div></div> )
}

export {Loader,ELoader}