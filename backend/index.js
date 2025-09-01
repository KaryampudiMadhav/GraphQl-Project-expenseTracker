import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import mergedResolvers from "./resolver/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import express from "express";
import http from "http";
import cors from "cors";
import { expressMiddleware } from "@as-integrations/express5";
import dotenv from "dotenv";
import { connectionDB } from "./db/ConnectionDb.js";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { buildContext } from "graphql-passport";
import { configurePassport } from "./passport/passport.config.js";

dotenv.config();

console.log("🔹 Step 1: Configuring Passport...");
configurePassport();

const app = express();
const httpServer = http.createServer(app);

console.log("🔹 Step 2: Setting up MongoDB session store...");
const MongoDbStore = connectMongo(session);
const store = new MongoDbStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

store.on("error", (err) => {
  console.error("❌ MongoDB session store error:", err);
});

console.log("🔹 Step 3: Configuring session middleware...");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
    store: store,
  })
);

console.log("🔹 Step 4: Initializing Passport...");
app.use(passport.initialize());
app.use(passport.session());

console.log("🔹 Step 5: Creating Apollo Server instance...");
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

console.log("🔹 Step 6: Starting Apollo Server...");
await server.start();

console.log("🔹 Step 7: Applying Express middleware for GraphQL...");
app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      console.log("📌 Session check:", req.session);
      console.log("📌 Authenticated user:", req.user);
      return buildContext({ req, res });
    },
  })
);

console.log("🔹 Step 8: Connecting to MongoDB...");
await connectionDB();

console.log("🔹 Step 9: Starting HTTP server...");
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Step 10: Server ready at http://localhost:4000/graphql`);
