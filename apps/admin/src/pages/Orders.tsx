import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { backendUrl } from "../config/exports";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { currency } from "../App";

type PaymentMethodType = "cod" | "razor" | "stripe";

type OrderedItemType = {
  productId: string;
  name: string;
  image: string[];
  price: number;
  quantity: number;
  sizes: string[];
};

type AddressType = {
  firstName: string;
  lastName: string;
  email: string;

  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;

  phone: string;
};

type OrderType = {
  _id: string;
  items: OrderedItemType[];
  amount: number;
  address: AddressType;
  status: string;
  payment: boolean;
  paymentMethod: PaymentMethodType;
  date: number;
};

const Orders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);

  const { token } = useAuth();
  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.get(`${backendUrl}/order/list`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
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
  };

  const statusHandler = async (e:React.ChangeEvent<HTMLSelectElement>,orderId:string) => {
    try {
      const response = await axios.post(`${backendUrl}/order/status`,{orderId,status:e.target.value},{
        withCredentials:true
      })
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error || "Something went wrong")
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])
  
  return (
    <div>
      <h3>Orders Page</h3>
      <div>
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="" />
            <div>
              {order.items.map((item, index) => {
                if (index === order.items.length - 1) {
                  return (
                    <p className="py-0.5" key={index}>
                      {item.name} x {item.quantity}{" "}
                      <span>{item.sizes}</span>{" "}
                    </p>
                  );
                } else {
                  return (
                    <p className="py-0.5" key={index}>
                      {item.name} x {item.quantity} <span>{item.sizes} </span>
                      ,{" "}
                    </p>
                  );
                }
              })}
            </div>
            <p className="mt-3 mb-2 font-medium">{`${order.address.firstName} ${order.address.lastName}`}</p>
            <div>
              <div>
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.country}, {order.address.pincode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Items : {order.items.length}
              </p>
              <p className="mt-3">Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? "Done" : "Pending"}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {currency}
              {order.amount}
            </p>
            <select onChange={(e:React.ChangeEvent<HTMLSelectElement> ) => statusHandler(e,order._id)} className="p-2 font-semibold" value={order.status}>
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
