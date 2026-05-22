import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, showSearch, getCartCount, isAuthenticated } =
    useContext(ShopContext);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to={"/"}>
        {" "}
        <img src={assets.logo} alt="Logo" className="w-36" />{" "}
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to={"/"} className={"flex flex-col items-center gap-1"}>
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink
          to={"/collection"}
          className={"flex flex-col items-center gap-1"}
        >
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to={"/about"} className={"flex flex-col items-center gap-1"}>
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to={"/contact"} className={"flex flex-col items-center gap-1"}>
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(!showSearch)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt=""
        />

        <div className="relative">
          {isAuthenticated ? (
            <div className="group">
              <img
                src={assets.profile_icon}
                className="w-5 cursor-pointer group"
                alt=""
              />

              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <NavLink to={"/"}>
                    {" "}
                    <p className="cursor-pointer hover:text-black">
                      My Profile
                    </p>
                  </NavLink>
                  <NavLink to={"/orders"}>
                    {" "}
                    <p className="cursor-pointer hover:text-black">
                      Orders
                    </p>
                  </NavLink>
                  <p onClick={() => {}} className="cursor-pointer hover:text-black">Logout</p>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to={"/auth"}
              className="bg-black text-white text-sm font-light px-2 py-1 rounded-xs"
            >
              Signup
            </Link>
          )}
        </div>

        <Link to={"/cart"} className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute -right-1.25 -bottom-1.25 w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px] ">
            {getCartCount()}
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* Sidebar Menu */}

      <div
        className={`flex flex-col absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-200 ${visible ? "w-full" : "w-0"}
        `}
      >
        <div
          onClick={() => setVisible(false)}
          className="flex items-center gap-4 p-3 cursor-pointer"
        >
          <img src={assets.dropdown_icon} alt="" className="h-4 rotate-180" />

          <p>Back</p>
        </div>

        <NavLink
          to="/"
          className={"py-2 pl-6 border-t"}
          onClick={() => setVisible(false)}
        >
          HOME
        </NavLink>
        <NavLink
          to="/collection"
          className={"py-2 pl-6 border-t"}
          onClick={() => setVisible(false)}
        >
          COLLECTION
        </NavLink>
        <NavLink
          to="/about"
          className={"py-2 pl-6 border-t"}
          onClick={() => setVisible(false)}
        >
          ABOUT
        </NavLink>
        <NavLink
          to="/contact"
          className={"py-2 pl-6 border-y"}
          onClick={() => setVisible(false)}
        >
          CONTACT
        </NavLink>
      </div>
    </div>
  );
};

export default NavBar;
