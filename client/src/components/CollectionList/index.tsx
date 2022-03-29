import { Add } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Pagination,
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
  const { data: followUps, refetch } = useFollowUpList();
  const { data = [], status } = useQuery<string[]>(
    "list-collections",
    collectionListFetcher
  );

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 30;
  const offset = (page - 1) * pageSize;

  const filtered = data.filter((value) => value.includes(keyword));
  const list = filtered.slice(offset, offset + pageSize);

  const hasNameInfollowUp = followUps?.some((fu) => fu === keyword);
  const validCollectionName = keyword.length === 12;

  const handleAddCollection = async (value: string) => {
    await axios.post(`http://localhost:1880/followUps/${value}`);
    await refetch();
  };

  return (
    <Card>
      <CardHeader title={"60 Newest Collections"} />
      <Divider variant={"middle"} />
      <CardContent>
        <Stack spacing={3} alignItems={"center"}>
          <TextField
            label={"Search / Add Collection"}
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
            <>
              <Grid container>
                <ItemList
                  items={list}
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
            </>
          )}
        </Stack>
        <Box mt={2}>
          <Divider variant={"middle"} />
        </Box>
        <Box mt={2} textAlign={"right"}>
          <Pagination
            count={Math.ceil(filtered.length / pageSize)}
            page={page}
            onChange={(_, page) => setPage(page)}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default CollectionList;
