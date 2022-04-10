import { useContext } from "react";
import FollowUpListContext from "./context";

const useFollowUpList = () => {
  const { query } = useContext(FollowUpListContext);
  const { data, isValidating, error, mutate } = query;

  return {
    data,
    isValidating,
    error,
    mutate,
  };
};

export default useFollowUpList;
