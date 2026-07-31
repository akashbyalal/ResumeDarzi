import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/register.jsx";
import Protected from "./features/auth/components/Protected.jsx";
import Home from "./features/interview/pages/Home.jsx"
import Interview from "./features/interview/pages/Interview.jsx";

const HomePage = () => <h1>homepages</h1>;

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
    errorElement: <div>Something went wrong.</div>,
  },
  {
    path: "/interview",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },
]);