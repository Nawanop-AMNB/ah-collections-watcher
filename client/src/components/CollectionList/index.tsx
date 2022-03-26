import { Add } from "@mui/icons-material";
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
import { useQuery } from "react-query";
import { useFollowUpList } from "../FollowUpList";
import ItemList from "../ItemList";

const collectionListFetcher = () =>
  axios.get("http://localhost:1880/collections").then((res) => res.data);

function CollectionList() {
  const { data: followUps, refetch } = useFollowUpList();
  const { data, status } = useQuery<string[]>(
    "list-collections",
    collectionListFetcher
  );

  const handleAddCollection = async (value: string) => {
    await axios.post(`http://localhost:1880/followUps/${value}`);
    await refetch();
  };

  return (
    <Card>
      <CardHeader title={"Collections"} />
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
                      color={"success"}
                      onClick={() => {
                        handleAddCollection(item);
                      }}
                      disabled={followUps?.includes(item)}
                    >
                      <Add />
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

export default CollectionList;
