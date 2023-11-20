import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import Account from "./components/Account/Account";
import { useEffect } from "react";
import { UserActions } from "./store/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { currentToken } from "./store/selectors";

function App() {
  const dispatch = useDispatch();
  const token = useSelector(currentToken);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(UserActions.getToken());
  }, [dispatch]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/">
          <Route index element={<Account />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
