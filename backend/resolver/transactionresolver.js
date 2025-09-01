import { transactionModel } from "./../models/transactions.model.js";
const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("User is Unautherized!");

        const userId = await context.getUser()._id;
        const transactions = await transactionModel.find({ userId });
        return transactions;
      } catch (error) {
        console.log(error);
        throw new Error("Error in the getting transaction");
      }
    },

    transaction: async (_, { transactionId }, __) => {
      try {
        const transaction = await transactionModel.findById(transactionId);
        return transaction;
      } catch (error) {
        console.log(error);
        throw new Error("Error in the getting transaction");
      }
    },

    // TODO categorical statistics.
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new transactionModel({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.log(error);
        throw new Error("Error in the creating transaction");
      }
    },
    updateTransaction: async (_, { input }, __) => {
      try {
        const updatedTransaction = await transactionModel.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updatedTransaction;
      } catch (error) {
        console.log("Error in updating transaction.");
        throw new Error("Error in updating the trasaction.");
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("Unauthorized");

        const transaction = await transactionModel.findOneAndDelete({
          _id: transactionId,
          userId: user._id,
        });

        if (!transaction) {
          throw new Error("Transaction not found or already deleted");
        }

        return transaction;
      } catch (error) {
        console.error("Delete Transaction Error:", error);
        throw new Error(error.message || "Error deleting the transaction.");
      }
    },
  },

  //TODO add trasactionRelationship
};

export default transactionResolver;
