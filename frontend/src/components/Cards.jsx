import { useQuery } from "@apollo/client/react";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/Queries/transaction.query";
import {
  GET_AUTHENTICATED_USER,
  GET_USER_AND_TRANSACTIONS,
} from "../graphql/Queries/user.query";

const Cards = () => {
  const { data, error, loading } = useQuery(GET_TRANSACTIONS);
  const { data: authUser } = useQuery(GET_AUTHENTICATED_USER);
  console.log(data);

  const { data: userData } = useQuery(GET_USER_AND_TRANSACTIONS, {
    variables: {
      userId: authUser?.authUser?._id,
    },
  });

  console.log("userDAta", userData);
  return (
    <div className="w-full px-10 min-h-[40vh]">
      <p className="text-5xl font-bold text-center my-10">History</p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
        {!loading &&
          data?.transactions.map((item) => (
            <Card key={item._id} item={item} authUser={authUser?.authUser} />
          ))}

        {!loading && data?.transactions?.length === 0 && (
          <p className="text-2xl font-bold text-center w-full">
            No transaction history found.
          </p>
        )}
      </div>
    </div>
  );
};
export default Cards;
