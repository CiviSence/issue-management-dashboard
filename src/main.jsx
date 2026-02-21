import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { IssueProvider } from "./Context/IssueContext.jsx";
import { ProfileDataProvider } from "./Context/ProfileContext.jsx";
import { UserProvider } from "./Context/UserContext.jsx";
import "remixicon/fonts/remixicon.css";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <ProfileDataProvider>
        <IssueProvider>
          <App />
        </IssueProvider>
      </ProfileDataProvider>
    </UserProvider>
  </BrowserRouter>,
);
