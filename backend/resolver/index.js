import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver.js";
import transactionResolver from "./transactionresolver.js";
const mergedResolvers = mergeResolvers([userResolver, transactionResolver]);

export default mergedResolvers;
