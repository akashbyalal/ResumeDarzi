import react from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes.jsx";
import { InterviewProvider } from "./features/interview/interview.Context.jsx";
import { AuthProvider } from "./features/auth/services/auth.context.jsx";
function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;
