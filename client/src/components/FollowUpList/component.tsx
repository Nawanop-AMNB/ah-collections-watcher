import { Close } from "@mui/icons-material";
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
import React, { useEffect, useState } from "react";
import ItemList from "../ItemList";
import useFollowUpList from "./hook";

export type IFollowUpList = {};

function FollowUpList() {
  const { data = [], isValidating, error, mutate } = useFollowUpList();

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const offset = (page - 1) * pageSize;

  const filtered = data.filter((value) => value.includes(keyword));
  const list = filtered.slice(offset, offset + pageSize);

  useEffect(() => {
    const maxPage = Math.ceil(filtered.length / pageSize);
    console.log(`max-page: ${maxPage} | current: ${page}`);
    if (maxPage && page > maxPage) {
      setPage(maxPage);
    }
  }, [data]);

  const handleRemoveCollection = async (value: string) => {
    await axios.delete(`http://localhost:1880/followUps/${value}`);
    await mutate();
  };

  return (
    <Card>
      <CardHeader title={"Follow-up list"} />
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
          {!isValidating && !error && data && (
            <Stack spacing={3} alignItems={"center"}>
              <Grid container>
                <Grid item xs={12}>
                  <ItemList
                    items={list}
                    sort={(i1, i2) => i1.localeCompare(i2)}
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
                </Grid>
              </Grid>
              <Box>
                <Pagination
                  count={Math.ceil(filtered.length / pageSize)}
                  page={page}
                  onChange={(_, page) => setPage(page)}
                />
              </Box>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default FollowUpList;
