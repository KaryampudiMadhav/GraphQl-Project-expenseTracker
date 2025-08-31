import { transactionModel } from "./../models/transactions.model.js";
const transactionResolver = {
  Query: {
    transactions: async (_, _, context) => {
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

    transaction: async (_, _, { transactionId }) => {
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
          userId: context.userId,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.log(error);
        throw new Error("Error in the creating transaction");
      }
    },
    updateTransaction: async (_, { input }, _) => {
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
    deleteTransaction: async (_, { transactionId }, _) => {
      try {
        const deletedTransaction = await transactionModel.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (error) {
        console.log("Error in updating transaction.");
        throw new Error("Error in updating the trasaction.");
      }
    },
  },

  //TODO add trasactionRelationship
};

export default transactionResolver;
