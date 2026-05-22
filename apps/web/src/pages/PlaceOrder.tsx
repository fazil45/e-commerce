import { useContext, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

type OrderItemType = {
  productId: string;
  name: string;
  price: number;
  image: string[];
  quantity: number;
  sizes: string[];
};

type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
};

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    cartItems,
    backendUrl,
    products,
    getCartAmount,
    delivery_fee,
    setCartItems,
  } = useContext(ShopContext);

  const initPay = (order:RazorpayOrder) =>{
    const options = {
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:"Order Payment",
      description:"Order Payment",
      order_id:order.id,
      receipt:order.receipt,
      handler: async(response:RazorpayResponse)=>{
        try {
          const {data}  = await axios.post(`${backendUrl}/order/verifyRazorPay`,{response},{withCredentials:true})
          if (data.success) {
            navigate("/orders")
            setCartItems({})
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data.error || "Something went wrong")
          } else {
            toast.error("Something went wrong")
          }
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      phone: "",
    },

    onSubmit: async ({ value }) => {
      try {
        let orderItems: OrderItemType[] = [];

        for (const itemsId in cartItems) {
          for (const size in cartItems[itemsId]) {
            if (cartItems[itemsId][size] > 0) {
              const product = products.find(
                (product) => product._id === itemsId,
              );
              const quantity = cartItems[itemsId][size];

              if (product) {
                orderItems.push({
                  productId: product._id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  sizes: [size],
                  quantity: quantity,
                });
              }
            }
          }
        }

        let orderData = {
          address: {
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
            street: value.street,
            city: value.city,
            state: value.state,
            country: value.country,
            pincode: value.pincode,
            phone: value.phone,
          },
          items: orderItems,
          amount: getCartAmount() + delivery_fee,
        };

        switch (method) {
          case "cod":
            const response = await axios.post(
              `${backendUrl}/order/place/cod`,
              orderData,
              {
                withCredentials: true,
              },
            );
            if (response.data.success) {
              setCartItems({});
              navigate("/orders ");
            }
            break;

          case "stripe":
            const responseStripe = await axios.post(
              `${backendUrl}/order/place/stripe`,
              orderData,
              {
                withCredentials: true,
              },
            );
            if (responseStripe.data.success) {
              const { session_url } = responseStripe.data;
              window.location.replace(session_url);
            } else {
              toast.error(responseStripe.data.error || "Something went wrong");
            }
            break;
          case "razor":
            const responseRazorpay = await axios.post(
              `${backendUrl}/order/place/razorpay`,
              orderData,
              { withCredentials: true },
            );
            if (responseRazorpay.data.success) {
              initPay(responseRazorpay.data.order)
            }
            break;
          default:
            break;
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-120">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>

        <div className="flex gap-3">
          {/* First Name */}
          <form.Field
            name="firstName"
            validators={{
              onChange: ({ value }) =>
                !value ? "First name is required" : undefined,
            }}
          >
            {(field) => (
              <div className="w-full">
                <input
                  type="text"
                  placeholder="First name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                />

                {field.state.meta.errors.length ? (
                  <p className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* Last Name */}
          <form.Field
            name="lastName"
            validators={{
              onChange: ({ value }) =>
                !value ? "Last name is required" : undefined,
            }}
          >
            {(field) => (
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Last name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                />

                {field.state.meta.errors.length ? (
                  <p className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
        </div>

        {/* Email */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Email is required";

              if (!/^\S+@\S+\.\S+$/.test(value)) {
                return "Invalid email";
              }

              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              />

              {field.state.meta.errors.length ? (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors[0]}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        {/* Street */}
        <form.Field
          name="street"
          validators={{
            onChange: ({ value }) =>
              !value ? "Street is required" : undefined,
          }}
        >
          {(field) => (
            <div>
              <input
                type="text"
                placeholder="Street"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              />

              {field.state.meta.errors.length ? (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors[0]}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <div className="flex gap-3">
          {/* City */}
          <form.Field
            name="city"
            validators={{
              onChange: ({ value }) =>
                !value ? "City is required" : undefined,
            }}
          >
            {(field) => (
              <div className="w-full">
                <input
                  type="text"
                  placeholder="City"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                />

                {field.state.meta.errors.length ? (
                  <p className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* State */}
          <form.Field
            name="state"
            validators={{
              onChange: ({ value }) =>
                !value ? "State is required" : undefined,
            }}
          >
            {(field) => (
              <div className="w-full">
                <input
                  type="text"
                  placeholder="State"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                />

                {field.state.meta.errors.length ? (
                  <p className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
        </div>

        <div className="flex gap-3">
          {/* Pincode */}
          <form.Field
            name="pincode"
            validators={{
              onChange: ({ value }) =>
                !value ? "Pincode is required" : undefined,
            }}
          >
            {(field) => (
              <div className="w-full">
                <input
                  type="number"
                  placeholder="Pin code"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                />

                {field.state.meta.errors.length ? (
                  <p className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* Country */}
          <form.Field
            name="country"
            validators={{
              onChange: ({ value }) =>
                !value ? "Country is required" : undefined,
            }}
          >
            {(field) => (
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Country"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                />

                {field.state.meta.errors.length ? (
                  <p className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
        </div>

        {/* Phone */}
        <form.Field
          name="phone"
          validators={{
            onChange: ({ value }) =>
              !value ? "Phone number is required" : undefined,
          }}
        >
          {(field) => (
            <div>
              <input
                type="number"
                placeholder="Phone number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              />

              {field.state.meta.errors.length ? (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors[0]}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>

      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div>
          <Title text1="PAYMENT" text2="METHOD" />

          {/* Payment Method */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-300" : ""
                }`}
              ></p>

              <img src={assets.stripe_logo} className="h-5 mx-4" alt="" />
            </div>

            <div
              onClick={() => setMethod("razor")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razor" ? "bg-green-300" : ""
                }`}
              ></p>

              <img src={assets.razorpay_logo} className="h-5 mx-4" alt="" />
            </div>

            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-300" : ""
                }`}
              ></p>

              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm cursor-pointer"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
