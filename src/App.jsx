import "./App.css";

import { useEffect, useState } from "react";

import Login from "./login/Login";
import Dashboard from "./pages/Dashboard";


function App() {

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [checkingSession, setCheckingSession] =
    useState(true);


  // =========================================================
  // CHECK EXISTING SESSION
  // =========================================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const clientId =
      localStorage.getItem("clientId");


    if (token && clientId) {

      setIsLoggedIn(true);

    } else {

      setIsLoggedIn(false);

    }


    setCheckingSession(false);

  }, []);


  // =========================================================
  // LOGIN SUCCESS
  // =========================================================

  const handleLogin = () => {

    const token =
      localStorage.getItem("token");

    const clientId =
      localStorage.getItem("clientId");


    if (token && clientId) {

      setIsLoggedIn(true);

    }

  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("clientId");
    localStorage.removeItem("email");

    setIsLoggedIn(false);

  };


  // =========================================================
  // SESSION LOADING
  // =========================================================

  if (checkingSession) {

    return (
      <div className="app-loading">
        Loading...
      </div>
    );

  }


  // =========================================================
  // APP
  // =========================================================

  return (

    <div className="App">

      {isLoggedIn ? (

        <Dashboard
          onLogout={handleLogout}
        />

      ) : (

        <Login
          onLogin={handleLogin}
        />

      )}

    </div>

  );

}


export default App;