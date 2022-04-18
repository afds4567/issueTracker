import { Route, Routes } from "react-router-dom";
import './App.css';
import Department from './Component/Department';
import Login from './Component/Login';
import Card from './Component/Card';
import IssueList from './Component/IssueList';
import Board from "./Component/Board/Board";
import CreateIssue from "./Component/Issue/CreateIssue";
function Router() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/project" element={<Card />} />
        <Route path="/Department" element={<Department />} />
        <Route path="/" element={<IssueList/>} />
        <Route path="/board" element={<Board />} />
        <Route path="/createIssue" element={<CreateIssue/>} />
      </Routes>
    </div>
  );
}

export default Router;