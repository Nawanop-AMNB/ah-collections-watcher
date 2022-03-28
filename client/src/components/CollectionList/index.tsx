import { Add } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useFollowUpList } from "../FollowUpList";
import ItemList from "../ItemList";

const collectionListFetcher = () =>
  axios.get("http://localhost:1880/collections").then((res) => res.data);

function CollectionList() {
  const [keyword, setKeyword] = useState("");
  const { data: followUps, refetch } = useFollowUpList();
  const { data, status } = useQuery<string[]>(
    "list-collections",
    collectionListFetcher
  );

  const hasNameInfollowUp = followUps?.some((fu) => fu === keyword);
  const validCollectionName = keyword.length === 12;

  const handleAddCollection = async (value: string) => {
    await axios.post(`http://localhost:1880/followUps/${value}`);
    await refetch();
  };

  return (
    <Card>
      <CardHeader title={"Collections"} />
      <Divider variant={"middle"} />
      <CardContent>
        <Stack spacing={3}>
          <TextField
            label={"Search"}
            onChange={(e) => setKeyword(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            autoComplete="off"
          />
          {keyword && !data?.some((d) => keyword === d) && (
            <Grid container alignItems={"center"}>
              <Grid item xs={1}>
                <IconButton
                  color={"success"}
                  onClick={() => {
                    handleAddCollection(keyword);
                  }}
                  disabled={hasNameInfollowUp || !validCollectionName}
                >
                  <Add />
                </IconButton>
              </Grid>
              <Grid item xs={11}>
                <Typography color={"textSecondary"}>
                  {followUps?.some((fu) => fu === keyword)
                    ? "Already added"
                    : "Add manually"}
                  : {keyword}
                </Typography>
              </Grid>
            </Grid>
          )}
          {status === "success" && (
            <Grid container>
              <ItemList
                items={data}
                cond={(item) => item.includes(keyword)}
                render={(item, index) => (
                  <>
                    <Grid item xs={6} key={`${item}-${index}`}>
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
                    </Grid>
                  </>
                )}
              />
            </Grid>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CollectionList;
