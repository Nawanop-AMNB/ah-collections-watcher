import { createContext } from "react";
import { SWRResponse } from 'swr';

export type IFollowUpListContext = {
  query: SWRResponse<string[]>;
};

const FollowUpListContext = createContext<IFollowUpListContext>(
  {} as IFollowUpListContext
);
export default FollowUpListContext;
