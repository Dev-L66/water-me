import SignupPage from "./pages/auth/signup/SignupPage";
import LoginPage from "./pages/auth/login/LoginPage";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router";
import { useQuery } from "@tanstack/react-query";
import HomePage from "./pages/HomePage.jsx";
import Navbar from "./components/common/Navbar";
import CreatePlant from "./pages/CreatePlant";
import EditPlant from "./pages/EditPlant";
import VerifyEmail from "./pages/VerifyEmail.jsx";

const App = () => {
  const {
    data: authUser,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    retry: false,
  });

  const isVerified = authUser?.isVerified;

  console.log(authUser);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.log(error.message);
  }

  return (
    <>
      {authUser && isVerified && <Navbar />}
      <div className="mx-auto ">
        <Routes>
          <Route path='/verify-email' element={authUser && !isVerified ? <VerifyEmail /> : <Navigate to="/login" />} />
          <Route
            path="/"
            element={
              authUser && isVerified ? <HomePage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/signup"
            element={!authUser ? (<SignupPage />) : isVerified ? (<Navigate to="/" />) : (<Navigate to="/verify-email" />)}
          />
          <Route
            path="/login"
            element={
              !authUser ? (
                <LoginPage />
              ) : isVerified ? (
                <Navigate to="/" />
              ) : (
                <Navigate to="/verify-email" />
              )
            }
          />

          <Route
            path="/create-plant"
            element={
              authUser && isVerified ? (
                <CreatePlant />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path={`/edit-plant/:plantId`}
            element={
              authUser && isVerified ? <EditPlant /> : <Navigate to="/login" />
            }
          />
        </Routes>
        <Toaster />
      </div>
    </>
  );
};

export default App;
