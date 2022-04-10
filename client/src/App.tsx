import {
  Grid
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import React from "react";
import CollectionList from "./components/CollectionList";
import FollowUpList from "./components/FollowUpList";

export default function App() {
  return (
    <Container maxWidth="md">
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <CollectionList />
          </Grid>
          <Grid item xs={4}>
            <FollowUpList />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
