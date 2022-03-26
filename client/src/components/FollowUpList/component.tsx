import { Close } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import ItemList from "../ItemList";
import useFollowUpList from "./hook";

export type IFollowUpList = {};

function FollowUpList() {
  const { data = [], status, refetch } = useFollowUpList();

  const handleRemoveCollection = async (value: string) => {
    await axios.delete(`http://localhost:1880/followUps/${value}`);
    await refetch();
  };

  return (
    <Card>
      <CardHeader title={"Follow-up list"} />
      <Divider variant={"middle"} />
      <CardContent>
        {status === "success" && (
          <ItemList
            items={data}
            render={(item) => (
              <>
                <Grid container alignItems={"center"}>
                  <Grid item xs={2}>
                    <IconButton
                      color={"error"}
                      onClick={() => {
                        handleRemoveCollection(item);
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography>{item}</Typography>
                  </Grid>
                </Grid>
              </>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default FollowUpList;
