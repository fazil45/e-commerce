import React, { type FormEvent } from "react";

const NewsletterBox = () => {
  const onSubmitHandler = (event: FormEvent) => {
    event.preventDefault();
  };
  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & get 20% off
      </p>
      <p className="text-gray-400 mt-3">
        {" "}
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo nam eaque
        ipsa architecto molestias?
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-4"
      >
        <input
          type="email"
          placeholder="Enter your Email"
          className="w-full sm:flex-1 outline-none"
          required
        />
        <button
          className="bg-black text-white text-xs px-10 sm:px-6 md:px-8 sm:p-2 md:py-3 py-4"
          type="submit"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
