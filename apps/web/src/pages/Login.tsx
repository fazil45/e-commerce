import React, { useState, type ChangeEvent } from "react";

const Login = () => {
  const [currentState, setCurrentState] = useState("Signup");
  const onSubmitHandler = async (event:ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
  }
  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
        />
      )}
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="password"
      />
      <div className="w-full flex justify-between text-sm -mt-2">
        <p className="cursor-pointer">Forgot your Password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Signup")}
            className="cursor-pointer"
          >
            Create an account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>
      <button type="submit" className="bg-black text-white font-light px-8 py-2 mt-4">{currentState === 'Login' ? 'Sign In' : 'Sign up'}</button>
    </form>
  );
};

export default Login;
