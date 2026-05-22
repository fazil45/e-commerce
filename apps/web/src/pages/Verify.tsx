import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const { navigate, isAuthenticated, setCartItems, backendUrl } =
    useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      if (!isAuthenticated) {
        return null;
      }

      if (!success || !orderId) {
        return null
      }

      const response = await axios.post(
        `${backendUrl}/order/verifyStripe`,
        { success, orderId },
        { withCredentials: true },
      );
      console.log(response.data)
      if (response.data.success) {
        setCartItems({})
        navigate("/orders")
        window.location.reload()
      } else {
        navigate("/cart")
      }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data.error || "Something went wrong")
        } else {
            toast.error("Something went wrong")
        }
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [isAuthenticated]);

  return <div></div>;
};

export default Verify;
