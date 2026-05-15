import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

type CurrentState = "Signup" | "Login";

const SignupCard = ({
  setCurrentState,
}: {
  setCurrentState: Dispatch<SetStateAction<CurrentState>>;
}) => {
  const { backendUrl} = useContext(ShopContext);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      if (value.name ==="") {
        return toast.error("Enter Name");
      }
      if (value.email === "") {
        return toast.error("Enter Email");
      }

      if (value.password === "") {
        return toast.error("Enter Password");
      }

      const name = value.name;
      const email = value.email;
      const password = value.password;

      try {
        const response = await axios.post(
          `${backendUrl}/auth/register`,
          {
            name,
            email,
            password,
          },
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          toast.success(response.data.message);
          setCurrentState("Login");
          form.reset()
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.error || "Something went wrong");
        } else {
          toast.error("Something went wrong");
        }
      }
    },
  });

  return (
    <div className=" bg-gray-200 rounded-2xl shadow-lg p-8 w-full max-w-md">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold mb-2">Sign Up</h2>

        <p className="text-gray-500 mb-2">Create your new account.</p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }} className="space-y-5">
        <form.Field
          name="name"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter your name"
                className="w-full border rounded-xl px-4 py-3 "
              />
            </div>
          )}
        />

        <form.Field
          name="email"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>

              <input
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter your email"
                className="w-full border rounded-xl px-4 py-3 "
              />
            </div>
          )}
        />

        <form.Field
          name="password"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>

              <input
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Create password"
                className="w-full border  rounded-xl px-4 py-3 "
              />
            </div>
          )}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition cursor-pointer"
          >
            Create Account
          </button>
          <span
            onClick={() => setCurrentState("Login")}
            className="bg-gray-800 text-sm text-white px-2 py-1.5 rounded-md hover:opacity-90 transition cursor-pointer"
          >
            Already have an account
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignupCard;
