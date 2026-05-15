import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets, type ProductType } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

export type CategoryType = "Man" | "Woman" | "Kids";
export type SubCategoryType = "Topwear" | "Bottomwear" | "Winterwear";

const Collection = () => {
  const { products,search,showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategoryType[]>([]);
  const [sortType, setSortType] = useState('relevant')

  const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value as CategoryType;

    if (category.includes(value)) {
      setCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setCategory((prev) => [...prev, value]);
    }
  };

  const toggleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value as SubCategoryType;

    if (subCategory.includes(value)) {
      setSubCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setSubCategory((prev) => [...prev, value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (search && showSearch) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category as CategoryType),
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory as SubCategoryType),
      );
    }

    setFilteredProducts(productsCopy);
  };

  const sortProduct = () => {
    let sortProductsCopy = filteredProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilteredProducts(sortProductsCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilteredProducts(sortProductsCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter()
        break;
    }
  };

  useEffect(() => {
    sortProduct();
  }, [sortType,products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory,search,showSearch,products]);

  useEffect(() => {
    setFilteredProducts(products);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Fiter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2 "
        >
          FILTERS
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            alt=""
          />
        </p>
        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6  ${showFilter ? "" : "hidden"} sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm  font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Men"}
                onChange={toggleCategory}
              />{" "}
              Man
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Women"}
                onChange={toggleCategory}
              />{" "}
              Woman
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Kids"}
                onChange={toggleCategory}
              />{" "}
              Kids
            </p>
          </div>
        </div>
        {/* Subcategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6  ${showFilter ? "" : "hidden"} sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm  font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Topwear"}
                onChange={toggleSubCategory}
              />{" "}
              Topwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Bottomwear"}
                onChange={toggleSubCategory}
              />{" "}
              Bottomwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Winterwear"}
                onChange={toggleSubCategory}
              />{" "}
              Winterwear
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 ">
        <div className="flex justify-between text-base sm:text-2xl mb-4 ">
          <Title text1="ALL" text2="COLLECTIONS" />

          {/* Product Sort */}
          <select onChange={(e:React.ChangeEvent<HTMLSelectElement>) => setSortType(e.target.value)} className="border-2 border-gray-300 text-sm px-2 outline-none">
            <option className="text-gray-600 " value="relevant">
              Sort by: Relevant
            </option>
            <option className="text-gray-600 " value="low-high">
              Sort by: Low to High
            </option>
            <option className="text-gray-600 " value="high-low">
              Sort by: High to Low
            </option>
          </select>
        </div>
        {/* Map Products*/}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filteredProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
