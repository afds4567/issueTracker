import { Route, Routes } from "react-router-dom";
import './App.css';
import Department from './Component/Department';
import Login from './Component/Login';
import Card from './Component/Card';
import Createprj from './Component/Createprj';
import IssueList from './Component/IssueList';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/project" element={<Card />} />
        <Route path="/Department" element={<Department />} />
        <Route path="/list" element={<IssueList/>} />
      </Routes>
    </div>
  );
}

export default App;
