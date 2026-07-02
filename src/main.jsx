import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { IssueProvider } from "./Context/IssueContext.jsx";
import { ProfileDataProvider } from "./Context/ProfileContext.jsx";
import { UserProvider } from "./Context/UserContext.jsx";
import { IssuesProvider } from "./Context/IssuesContext.jsx";
import { NotificationProvider } from "./Components/NotificationProvider.jsx";
import "./assets/remixicon-custom.css";

registerSW({
  immediate: true,
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <ProfileDataProvider>
        <IssuesProvider>
          <IssueProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </IssueProvider>
        </IssuesProvider>
      </ProfileDataProvider>
    </UserProvider>
  </BrowserRouter>,
);
