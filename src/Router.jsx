import { Route, Routes } from "react-router-dom";
import './App.css';
import Department from './Component/Department';
import Card from './Component/Selectprj';
import IssueList from './Component/IssueList';
import Board from "./Component/Board/Board";
import CreateIssue from "./Component/Issue/CreateIssue";
import ViewIssue from "./Component/Issue/ViewIssue";
import LoginSlack from "./Component/Slack";
import OAuth2RedirectHandler from "./Component/OAuth2RedirectHandler";
import Testview from "./Component/Comment/Testview";
import MyIssue from "./Component/Myissue"
function Router() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginSlack />} />
        <Route path="/slack/oauth_redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/project" element={<Card />} />
        <Route path="/project/:projectId" element={<IssueList />} />
        <Route path="/project/:projectId/create" element={<CreateIssue />} />
        <Route path="/project/MyIssue" element={<MyIssue />} />
        <Route path="/Department" element={<Department />} />
        <Route path="/" element={<IssueList/>} />
        <Route path="/board/:projectId" element={<Board />} />
        <Route path="/createIssue" element={<CreateIssue />} />
        <Route path="/issue/:issueId" element={<ViewIssue />} />
        <Route path="/comment" element={<Testview />} />
      </Routes>
    </div>
  );
}

export default Router;