import { createContext } from "react";
import { UseQueryResult } from "react-query";

export type IFollowUpListContext = {
  query: UseQueryResult<string[]>;
};

const FollowUpListContext = createContext<IFollowUpListContext>(
  {} as IFollowUpListContext
);
export default FollowUpListContext;
