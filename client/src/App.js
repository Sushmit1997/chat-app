import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Chat from "./pages/Chat/Chat";
import { useSelector } from "react-redux";
import { ToastProvider } from 'react-toast-notifications';

function App() {
  const user = useSelector((state) => state.authReducer.authData);
  return (
    <div
      className="App"
    >
      <ToastProvider autoDismiss={true}>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="chat" /> : <Navigate to="auth" />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="../chat" /> : <Auth />}
        />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
         <Route
          path="/chat"
          element={
           <Chat/>
          }
        />
      </Routes>
      </ToastProvider>
    </div>
  );
}

export default App;