import { useContext } from "react";
import FollowUpListContext from "./context";

const useFollowUpList = () => {
  const { query } = useContext(FollowUpListContext);
  const { data, status, refetch } = query;

  return {
    data,
    status,
    refetch,
  };
};

export default useFollowUpList;
