import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import SocketProvider from "./contexts/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <SocketProvider>
        <App />
        <Toaster closeButton position="top-center" />

      </SocketProvider>
  </Provider>
);
