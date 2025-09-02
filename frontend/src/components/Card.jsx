import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client/react";
import { DELETE_TRANSACTION } from "../graphql/Mutations/transaction.mutation";

const categoryColorMap = {
  saving: "from-green-700 to-green-400",
  expense: "from-pink-800 to-pink-600",
  investment: "from-blue-700 to-blue-400",
};

const Card = ({ item }) => {
  const [deleteTransaction, { loading, error }] = useMutation(
    DELETE_TRANSACTION,
    {
      refetchQueries: ["GetTransactions", "GetStats"],
    }
  );

  const handleDelete = async () => {
    try {
      await deleteTransaction({
        variables: { transactionId: item._id },
      });
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error(error.message);
    }
  };
  const date = formatDate(item.date);
  const cardClass = categoryColorMap[item.category];
  const description =
    item.description[0]?.toUpperCase() + item.description.slice(1);
  const category = item.category[0]?.toUpperCase() + item.category.slice(1);
  const paymentType =
    item.paymentType[0]?.toUpperCase() + item.paymentType.slice(1);
  return (
    <div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-white">{category}</h2>
          <div className="flex items-center gap-2">
            {!loading && (
              <FaTrash className={"cursor-pointer"} onClick={handleDelete} />
            )}
            {loading && (
              <div className="w-6 h-6 border-t-2 mx-2 rounded-full animate-spin"></div>
            )}
            <Link to={`/transaction/${item._id}`}>
              <HiPencilAlt className="cursor-pointer" size={20} />
            </Link>
          </div>
        </div>
        <p className="text-white flex items-center gap-1">
          <BsCardText />
          Description: {description}
        </p>
        <p className="text-white flex items-center gap-1">
          <MdOutlinePayments />
          Payment Type: {paymentType}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaSackDollar />
          Amount: {item.amount}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaLocationDot />
          Location: {item.location || "UnKnown"}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-black font-bold">{date}</p>
          <img
            src={"/laxmi.jpg"}
            className="h-8 w-8 border rounded-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
export default Card;
