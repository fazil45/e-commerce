import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
type CurrentState = "Signup" | "Login";

const LoginCard = ({
  setCurrentState,
}: {
  setCurrentState: Dispatch<SetStateAction<CurrentState>>;
}) => {
  const { backendUrl, navigate } = useContext(ShopContext);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      if (value.email === "") {
        toast.error("Enter Email");
        return;
      }

      if (value.password === "") {
        toast.error("Enter Password");
        return;
      }

      const email = value.email;
      const password = value.password;

      try {
        const response = await axios.post(
          `${backendUrl}/auth/login`,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          toast.success(response.data.message);
          navigate("/");
          window.location.reload()
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.error || "Login failed");
        } else {
          toast.error("Something went wrong");
        }
      }
    },
  });

  return (
    <div className="bg-gray-200 rounded-2xl shadow-lg p-8 w-full max-w-md">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-2">Login</h2>

        <p className="text-gray-500 mb-6">Welcome back! Please login.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
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
                className="w-full border rounded-xl px-4 py-1"
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
                placeholder="Enter your password"
                className="w-full border  rounded-xl px-4 py-1"
              />
            </div>
          )}
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
          >
            Login
          </button>
          <span
            onClick={() => setCurrentState("Signup")}
            className="bg-gray-800 text-sm text-white px-2 py-1.5 rounded-md hover:opacity-90 transition cursor-pointer"
          >
            Create new account
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginCard;
