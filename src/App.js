// src/App.js
import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Login from "./Login";
import PersonalityTest from "./PersonalityTest";
import AptitudeTest from "./AptitudeTest";

function App() {
  const [currentView, setCurrentView] = useState("loading");
  const [user, setUser] = useState(null);
  const [personalityScores, setPersonalityScores] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setCurrentView(u ? "personality" : "login");
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setPersonalityScores(null);
    setCurrentView("login");
  };

  // Inject Dialogflow Messenger script
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="App">
      <div className="App-content">
        {currentView === "loading" && <div>Loading...</div>}

        {currentView === "login" && (
          <Login goToTest={() => setCurrentView("personality")} />
        )}

        {currentView === "personality" && (
          <PersonalityTest
            onComplete={(scores) => {
              setPersonalityScores(scores);
              setCurrentView("aptitude");
            }}
            goBack={handleLogout}
          />
        )}

        {currentView === "aptitude" && (
          <AptitudeTest
            goBack={() => setCurrentView("personality")}
            personalityScores={personalityScores}
            goToLogin={handleLogout}
          />
        )}
      </div>

      {/* 👇 Dialogflow Messenger Widget */}
      <df-messenger
        intent="WELCOME"
        chat-title="CareerandSkillsBot"
        agent-id="89fddafa-451f-4e43-9b9f-7338afce855e"
        language-code="en"
      ></df-messenger>
    </div>
  );
}

export default App;
