import { Add } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import CollectionList from "./components/CollectionList";
import FollowUpList, { useFollowUpList } from "./components/FollowUpList";

export default function App() {
  const [colName, setColName] = useState("");
  const { refetch } = useFollowUpList();

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
