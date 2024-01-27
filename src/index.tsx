import { ThemeProvider } from "@mui/material";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.scss";
import PaletteModeProvider from "./providers/PaletteModeProvider";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { mainTheme } from "./themes";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>{/* redux store */}
      <PaletteModeProvider>{/* dark, light modes */}
        <ThemeProvider theme={mainTheme}>
          <App />
        </ThemeProvider>
      </PaletteModeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
