import  {  useContext } from "react";
import SignupCard from "../components/SignUp";
import LoginCard from "../components/Login";
import { ShopContext } from "../context/ShopContext";

const Auth = () => {
  const {currentState, setCurrentState} = useContext(ShopContext)



  return (
   <div className="flex items-center justify-center">
    {currentState === "Signup" ? <SignupCard setCurrentState={setCurrentState}/> : <LoginCard setCurrentState={setCurrentState}/>}
   </div>
  );
};

export default Auth;
