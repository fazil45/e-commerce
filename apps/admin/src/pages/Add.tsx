import { formOptions, useForm } from "@tanstack/react-form";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config/exports";

type Category = "Men" | "Women" | "Kids";
type SubCategory = "Topwear" | "Bottomwear" | "Winterwear";
type Size = "S" | "M" | "L" | "XL" | "XXL";

const formOpts = formOptions({
  defaultValues: {
    image1: undefined as File | undefined,
    image2: undefined as File | undefined,
    image3: undefined as File | undefined,
    image4: undefined as File | undefined,
    name: "",
    description: "",
    price: "",
    category: "Men" as Category,
    subCategory: "Topwear" as SubCategory,
    bestseller: false,
    sizes: [] as Size[],
  },
});

const Add = () => {
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      const formData = new FormData();

      formData.append("name", value.name);
      formData.append("description", value.description);
      formData.append("price", value.price);
      formData.append("category", value.category);
      formData.append("subCategory", value.subCategory);
      formData.append("bestseller", String(value.bestseller));
      formData.append("sizes", JSON.stringify(value.sizes));

      if (value.image1) formData.append("image1", value.image1);
      if (value.image2) formData.append("image2", value.image2);
      if (value.image3) formData.append("image3", value.image3);
      if (value.image4) formData.append("image4", value.image4);

      for (const [key, val] of formData.entries()) {
        console.log(key, val);
      }
      try {
        const response = await axios.post(
          `${backendUrl}/product/add`,
          formData,
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          toast.success("Product added successfully");
          form.reset()
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.error);
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
    >
      <div className="flex flex-col w-full items-start gap-1">
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {(["image1", "image2", "image3", "image4"] as const).map((key) => (
            <form.Field key={key} name={key}>
              {(field) => (
                <label htmlFor={key}>
                  <img
                    className="w-20"
                    src={
                      field.state.value
                        ? URL.createObjectURL(field.state.value)
                        : assets.upload_area
                    }
                    alt=""
                  />
                  <input
                    type="file"
                    id={key}
                    hidden
                    onChange={(e) => field.handleChange(e.target.files?.[0])}
                  />
                </label>
              )}
            </form.Field>
          ))}
        </div>
      </div>
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => (!value ? "Name is required" : undefined),
        }}
      >
        {(field) => (
          <div className="w-full">
            <p className="mb-2">Product Name</p>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="w-full max-w-125 px-2 py-3"
              type="text"
              placeholder="Type here"
            />
            {field.state.meta.errors && (
              <p className="text-red-500 text-sm">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>
      <form.Field name="description">
        {(field) => (
          <div className="w-full">
            <p className="mb-2">Product Description</p>
            <textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full max-w-125 px-3 py-2"
              placeholder="Description"
            />
          </div>
        )}
      </form.Field>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 w-full">
        <form.Field name="category">
          {(field) => (
            <div className="ml-2">
              <p className="mb-2">Product Category</p>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as Category)}
                className="w-full px-3 py-2"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="subCategory">
          {(field) => (
            <div>
              <p className="mb-2">Product Sub Category</p>
              <select
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(e.target.value as SubCategory)
                }
                className="w-full px-3 py-2"
              >
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="price">
          {(field) => (
            <div>
              <p className="mb-2">Product Price</p>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 sm:w-20"
                type="number"
                min={0}
                placeholder="Price"
              />
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="sizes">
        {(field) => (
          <div>
            <p className="mb-2">Product Sizes</p>
            <div className="flex gap-3">
              {(["S", "M", "L", "XL", "XXL"] as Size[]).map((size) => (
                <div
                  key={size}
                  onClick={() => {
                    const current = field.state.value;
                    field.handleChange(
                      current.includes(size)
                        ? current.filter((s) => s !== size)
                        : [...current, size],
                    );
                  }}
                >
                  <p
                    className={`px-3 py-1 cursor-pointer ${
                      field.state.value.includes(size)
                        ? "bg-pink-100 border border-pink-400"
                        : "bg-slate-200"
                    }`}
                  >
                    {size}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </form.Field>

      {/* Bestseller */}
      <form.Field name="bestseller">
        {(field) => (
          <div className="flex gap-2 mt-2">
            <input
              type="checkbox"
              id="bestseller"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
            />
            <label htmlFor="bestseller" className="cursor-pointer">
              Add to Bestseller
            </label>
          </div>
        )}
      </form.Field>

      {/* Submit */}
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-28 py-3 bg-black text-white rounded-md mt-1 disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "ADD"}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
};

export default Add;
