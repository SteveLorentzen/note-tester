import "./App.css";
import {Sessions} from "./components/Sessions";
import HostNoteTester from "./components/HostNoteTester";
import GuestNoteTester from "./components/GuestNoteTester";
import {Switch, Route} from "react-router-dom";

function AuthenticatedApp() {
  return (
    <div className="App">
      <Switch>
        <Route path="/hosted-session/:sessionId" component={HostNoteTester} />
        <Route path="/guest-session/:sessionId" component={GuestNoteTester} />
        <Route path="/" component={Sessions} />
      </Switch>
    </div>
  );
}

export default AuthenticatedApp;
