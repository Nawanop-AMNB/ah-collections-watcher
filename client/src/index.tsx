import { QueryClientProvider, QueryClient } from "react-query";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import FollowUpListProvider from "./components/FollowUpList/provider";

import "./index.css";

const client = new QueryClient();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />

    <QueryClientProvider client={client}>
      <FollowUpListProvider>
        <App />
      </FollowUpListProvider>
    </QueryClientProvider>
  </ThemeProvider>,
  document.querySelector("#root")
);
