import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import { findUser } from "./auth.repository.js";
import { getUserRoles } from "../user_role/user_role.repository.js";
import { getRoleId } from "../role/role.repository.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        //first_name, last_name, email, phone_number, password, role, dob
        const payload = {
          first_name: profile.given_name,
          last_name: profile.family_name,
          email: profile.email,
          role: "Customer",
        };
        const user = await findUser({ email: profile.email });
        if (user) {
          // if user exists,
          const userRole = await getUserRoles(user.uuid);

          // get role id based on role and then compare if user has given role
          const role = await getRoleId(roleType);

          if (!userRole.includes(role.uuid)) {
            throw new Error("User doesn't exist, Please register!");
          }

          const { accessToken, refreshToken } =
            await userDetails.generateAuthToken(role.uuid);

          return done(null, { user: user, accessToken, refreshToken });
        }
        console.log(profile);
        done(null, profile);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => {
  done(null, user);
});
