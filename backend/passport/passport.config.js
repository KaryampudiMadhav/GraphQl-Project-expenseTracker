import passport from "passport";
import { GraphQLLocalStrategy } from "graphql-passport";
import { userModel } from "./../models/user.model";
import bcrypt from "bcryptjs";

export const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    console.log(`Serializing User ${user}`);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log(`Deserializing User ${id}`);
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await userModel.findOne({ username });
        if (!user) {
          throw new Error("username or password is incorrect.");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new Error("username or password is incorrect.");
        }
        done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};
