import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import InitialMenu from "./routes/InitialMenu";
import LocalMatch from "./routes/LocalMatch";
import OnlineMatch from "./routes/OnlineMatch";

const router = createBrowserRouter([
  {
    path: "/",
    element: <InitialMenu />,
  },
  {
    path: "/local",
    element: <LocalMatch />,
  },
  {
    path: "/online/:id",
    element: <OnlineMatch />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
