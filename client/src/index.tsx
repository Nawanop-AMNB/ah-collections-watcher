import { QueryClientProvider, QueryClient } from "react-query";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import FollowUpListProvider from "./components/FollowUpList/provider";

import "./index.css";
import { GlobalStyles } from "@mui/material";

const client = new QueryClient();

const globalStyles = (
  <GlobalStyles
    styles={{
      "::-webkit-scrollbar": {
        width: 4,
        height: 10,
      },
      "::-webkit-scrollbar-thumb": {
        background: "#5c5c5c",
        WebkitBorderRadius: "4px",
      },
    }}
  />
);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    {globalStyles}
    <QueryClientProvider client={client}>
      <FollowUpListProvider>
        <App />
      </FollowUpListProvider>
    </QueryClientProvider>
  </ThemeProvider>,
  document.querySelector("#root")
);
