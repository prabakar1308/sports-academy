import { Routes, Route } from "react-router-dom";
// import firebase from "firebase";
import "./App.css";
import HeaderNavigation from "./components/header-navigation/HeaderNavigation";
import Dashboard from "./modules/dashboard/dashboard";
import Cricket from "./modules/cricket/cricket";
import Shuttle from "./modules/shuttle/shuttle";
import Booking from "./modules/booking/booking";
import CreateMatch from "./modules/cricket/components/create-match/CreateMatch";
import AdvancedSettings from "./modules/cricket/components/advanced-settings/AdvancedSettings";
import Scoreboard from "./modules/cricket/components/scoreboard/Scoreboard";
import FinalScoreboard from "./modules/cricket/components/final-scoreboard/FinalScoreboard";
import ViewMatchList from "./modules/cricket/components/view-match-list/ViewMatchList";

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyBiwHjB0-V0ZdxoykRq-U3188bS3KWo3uM",
    authDomain: "react-sample-bf33c.firebaseapp.com",
    projectId: "react-sample-bf33c",
    storageBucket: "react-sample-bf33c.appspot.com",
    messagingSenderId: "424213479397",
    appId: "1:424213479397:web:cc3cc794f7cdba8765b90c",
  };

  // if (!firebase.apps.length) {
  //   firebase.initializeApp(firebaseConfig);
  // }

  return (
    <div className="App">
      <HeaderNavigation></HeaderNavigation>
      {/* <BrowserRouter> */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="cricket" element={<Cricket />}>
          <Route path="new-match" element={<CreateMatch />} />
          <Route path="matches" element={<ViewMatchList />} />
          <Route path="settings" element={<AdvancedSettings />} />
          <Route path="scoreboard" element={<Scoreboard />} />
          <Route path="finalscore" element={<FinalScoreboard />} />
        </Route>
        <Route path="shuttle" element={<Shuttle />} />
        <Route path="booking" element={<Booking />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
      {/* </BrowserRouter> */}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Editing <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
