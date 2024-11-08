import axios from "axios";
import React, { PropsWithChildren } from "react";
import useSWR from "swr";
import FollowUpListContext from "./context";

const watchListFetcher = () =>
  axios.get("http://localhost:1880/followUps").then((res) => res.data);

function FollowUpListProvider(props: PropsWithChildren<{}>) {
  const query = useSWR<string[]>("list-follow-ups", watchListFetcher);
  const {} = query;
  return (
    <FollowUpListContext.Provider value={{ query }}>
      {props.children}
    </FollowUpListContext.Provider>
  );
}

export default FollowUpListProvider;
