import { Routes, Route, useLocation } from "react-router-dom";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import { useSelector } from "react-redux";

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
import BottomNavigationMenu from "./components/bottom-navigation/BottomNavigation";
// import Login from "./components/login/Login";

function App() {
  const location = useLocation();

  const {
    scoreboardEntries,
    scoreboard: { isMatchCompleted },
  } = useSelector((state) => state.cricket);
  // const firebaseConfig = {
  //   apiKey: "AIzaSyBiwHjB0-V0ZdxoykRq-U3188bS3KWo3uM",
  //   authDomain: "react-sample-bf33c.firebaseapp.com",
  //   projectId: "react-sample-bf33c",
  //   storageBucket: "react-sample-bf33c.appspot.com",
  //   messagingSenderId: "424213479397",
  //   appId: "1:424213479397:web:cc3cc794f7cdba8765b90c",
  // };

  // if (!firebase.apps.length) {
  //   firebase.initializeApp(firebaseConfig);
  // }

  const unSavedChanges =
    scoreboardEntries &&
    scoreboardEntries.length > 1 &&
    (location.pathname === "/cricket/scoreboard" ||
      (location.pathname === "/cricket/finalscore" && !isMatchCompleted));

  return (
    <div className="App">
      <BrowserView>
        <HeaderNavigation></HeaderNavigation>
      </BrowserView>
      {/* <BrowserRouter> */}
      <div className="routes-section">
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
      </div>
      <MobileView>
        <BottomNavigationMenu
          navigationItems={[
            { label: "Clients", icon: <DashboardIcon />, path: "/" },
            { label: "Cricket", icon: <SportsCricketIcon />, path: "/cricket" },
            { label: "Booking", icon: <BookOnlineIcon />, path: "/booking" },
          ]}
          unSavedChanges={unSavedChanges}
        />
      </MobileView>
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
