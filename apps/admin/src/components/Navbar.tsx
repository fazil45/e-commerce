import axios from "axios";
import { assets } from "../assets/assets";

const Navbar = () => {
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_HTTP_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center py-1 px-[4%] justify-between">
      <img className="w-[max(10%,80px)] " src={assets.logo} alt="" />
      <button
        onClick={handleLogout}
        className="bg-gray-600 cursor-pointer text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
