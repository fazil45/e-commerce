import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl } from "../config/exports";
import { toast } from "react-toastify";
import { currency } from "../App";

export type Size = "S" | "M" | "L" | "XL" | "XXL";


export type ProductType = {
        _id: string ,
        name: string,
        description:string,
        price: number,
        image: string[],
        category: string,
        subCategory: string,
        sizes: Size[],
        date: number,
        bestseller: boolean
    }

const List = () => {
  const [list, setList] = useState<ProductType[]>([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/product/list`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        toast.error(error.response?.data.error || "Something went wrong");
      } else {
        toast.error("Something went wrong")
      }
    }
  };

  const removeProduct = async (productId:string) => {
    try {
      const response = await axios.delete(`${backendUrl}/product/remove/${productId}`)

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.error)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.error || "Something went wrong")
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  useEffect(() => {
    fetchList();
  }, []);
  return <>
    <p className="mb-2">All Products List</p>
    <div className="flex flex-col gap-2">
      {/* List Table Title */}
      <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border-gray-50 bg-gray-200 text-sm ">
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b className="text-center">Action</b>
      </div>

      {/* Product list */}

      {
        list.map((item,index) => (
          <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 text-sm" key={index}>
            <img className="w-12" src={item.image[0]}  alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p onClick={() => removeProduct(item._id)} className="text-right md:text-center cursor-pointer text-lg">X</p>
          </div>
        ))
      }
    </div>
  </>;
};

export default List;
