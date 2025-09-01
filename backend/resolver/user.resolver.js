import { userModel } from "./../models/user.model.js";
import bcrypt from "bcryptjs";
const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, password, name, gender } = input;
        if (!username || !password || !name || !gender) {
          throw new Error("All fields are required.");
        }
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
          throw new Error("User alredy Exists.");
        }
        const salts = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salts);

        const boysProfilePic = `https://avatar.iran.liara.run/public/boy?{username=$username}`;
        const girlsProfilePic = `https://avatar.iran.liara.run/public/girl?{username=$username}`;

        const newUser = userModel({
          username,
          password: hashedPassword,
          gender,
          name,
          profilePic: gender === "male" ? boysProfilePic : girlsProfilePic,
        });

        await newUser.save();

        await context.login(newUser);

        return newUser;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Error while signUp");
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if (!username || !password) {
          throw new Error("All fields are required.");
        }

        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        await context.login(user);

        return user;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Error while login");
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) throw err;
        });
        context.res.clearCookie("connect.sid");

        return { message: "User LoggedOut successfully." };
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Error while signUp");
      }
    },
  },
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Error while signUp");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await userModel.findById(userId);
        return user;
      } catch (error) {
        console.log(error);
        throw new Error("Error in the getting User.");
      }
    },
  },

  // TODO relationship for the Transaction.
};

export default userResolver;
