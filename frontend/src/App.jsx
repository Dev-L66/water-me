import SignupPage from "./pages/auth/signup/SignupPage";
import LoginPage from "./pages/auth/login/LoginPage";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router";
import { useQuery} from "@tanstack/react-query";
import HomePage from "./pages/HomePage";
import Navbar from "./components/common/Navbar";
import CreatePlant from "./pages/CreatePlant";

const App = () => {

  const {data:authUser, isLoading, isError, error} = useQuery({
    queryKey:['authUser'],
    queryFn: async()=>{
      try{
      const res = await fetch('/api/auth/me',{
        method: "GET",
        credentials: 'include'
      });
      const data = await res.json();
      if(!res.ok){
        throw new Error(data.error || "Something went wrong!");
      }
      return data;
    }catch(error){
      console.error(error);
      throw error;
    }
    }, retry: false,
  });

 if(isLoading){
    return <div>Loading...</div>
  }

  if(isError){
    console.log(error.message);
  }
 
  return (
    <>
    {authUser && <Navbar/>}
    <div className="mx-auto "> 
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to='/login'/>  } />
          <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/create-plant" element={authUser ? <CreatePlant /> : <Navigate to="/login" />} />
        </Routes>
      <Toaster />
    </div>
    </>
  );
};

export default App;
