import { gql } from "@apollo/client";

export const GET_AUTHENTICATED_USER = gql`
  query GetAUTHENTICATEDUSER {
    authUser {
      _id
      username
      profilePicture
      name
    }
  }
`;
