import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./App.css"
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </BrowserRouter>,
);

