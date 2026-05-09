import { useForm } from "@tanstack/react-form";
import type React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password,setPassword] = useState('')

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({value}) => {
        if (value.email === '' ) {
            return toast.error('Enter email')
        } else {
            setEmail(value.email)
        }

        if (value.password === '' ) {
            return toast.error('Enter password')
        } else {
            setEmail(value.password)
        }

        try {
            const response = await axio
        } catch (error) {
            
        }

    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <form onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
        }}>
          <div className="mb-3 min-w-72">
            <form.Field
              name="email"
              children={(field) => {
                return (
                  <>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </p>
                    <input
                      className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                      type="email"
                      onBlur={field.handleBlur}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      placeholder="your@gmail.com"
                      required
                    />
                  </>
                );
              }}
            />
          </div>
          <div className="mb-3 min-w-72">
            <form.Field
              name="password"
              children={(field) => {
                return (
                  <>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Password
                    </p>
                    <input
                      className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                      type="password"
                      onBlur={field.handleBlur}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      placeholder="Enter your password"
                      required
                    />
                  </>
                );
              }}
            />
          </div>
          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
