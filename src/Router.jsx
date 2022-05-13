import { Route, Routes } from "react-router-dom";
import './App.css';
import Department from './Component/Department';
import Login from './Component/Login';
import Card from './Component/Selectprj';
import IssueList from './Component/IssueList';
import Board from "./Component/Board/Board";
import CreateIssue from "./Component/Issue/CreateIssue";
import LoginSlack from "./Component/Slack";
import OAuth2RedirectHandler from "./Component/OAuth2RedirectHandler";
import Testview from "./Component/Comment/Testview";
function Router() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginSlack />} />
        <Route path="/slack/oauth_redirect" element={<OAuth2RedirectHandler />} />
        
        <Route path="/project" element={<Card />} />
        <Route path="/project/:projectId" element={<Card />} />
        <Route path="/Department" element={<Department />} />
        <Route path="/" element={<IssueList/>} />
        <Route path="/board" element={<Board />} />
        <Route path="/createIssue" element={<CreateIssue />} />
        <Route path="/comment" element={<Testview />} />
      </Routes>
    </div>
  );
}

export default Router;