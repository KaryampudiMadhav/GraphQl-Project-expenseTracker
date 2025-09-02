import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      _id
      amount
      paymentType
      location
      date
      category
      description
    }
  }
`;

export const GET_TRANSACTION = gql`
  query GetTransaction($transactionId: ID!) {
    transaction(transactionId: $transactionId) {
      _id
      amount
      paymentType
      location
      date
      category
      description

      user {
        _id
        username
        name
        profilePicture
      }
    }
  }
`;

export const GET_STATS = gql`
  query GetStats {
    categoricalStatistics {
      totalAmount
      category
    }
  }
`;
