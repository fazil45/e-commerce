import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

type PaymentMethodType = "cod" | "razor" | "stripe";

type OrderedProductType = {
  productId: string;
  name: string;
  image: string[];
  price: number;
  quantity: number;
  sizes: string[];

  status: string;
  payment: boolean;
  paymentMethod: PaymentMethodType;
  date: number;
};

const Order = () => {
  const { isAuthenticated, backendUrl, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState<OrderedProductType[]>([]);

  const loadOrderData = async () => {
    try {
      if (!isAuthenticated) {
        const response = await axios.get(`${backendUrl}/order/userorders`, {
          withCredentials: true,
        });

        if (response.data.success) {
          let allOrderItems: OrderedProductType[] = [];
          response.data.orders.map(
            (order: {
              items: OrderedProductType[];
              status: string;
              payment: boolean;
              paymentMethod: PaymentMethodType;
              date: number;
            }) => {
              order.items.map((item) => {
                item["status"] = order.status;
                item["payment"] = order.payment;
                item["paymentMethod"] = order.paymentMethod;
                item["date"] = order.date;
                allOrderItems.push(item);
              });
            },
          );

          setOrderData(allOrderItems);
          console.log(allOrderItems);
        } else {
          toast.error(response.data.error);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error || "Somthing went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [orderData]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1="MY" text2="ORDERS" />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div
            className="py-4 border-t  text-gray-400 flex flex-col  md:flex-row md:items-center md:justify-between gap-4 "
            key={index}
          >
            <div className="flex items-start gap-6 text-sm">
              <img src={item.image[0]} className="w-16 sm:w-20" alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                  <p className="text-lg">
                    {currency}
                    {item.price}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.sizes}</p>
                </div>
                <p className="mt-2">
                  Date:{" "}
                  <span className="text-gray-400">
                    {new Date(item.date).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <button
                onClick={loadOrderData}
                className="border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer"
              >
                Track order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
