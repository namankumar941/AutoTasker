require("dotenv").config()
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const express = require("express");

//----------------------------------------------class----------------------------------------------

class Authentication {
  constructor() {
    this.initPassport();
  }
  // Initialize passport configuration
  initPassport() {
    // Serialize user information into the session
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    //deserialize User
    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    //creating user using google strategy
    passport.use(
      new googleStrategy(
        {
          clientID: process.env.clientId,
          clientSecret: process.env.clientSecret,
          callbackURL: "/auth/google/redirect",
        },
        async (accessToken, refreshToken, profile, done) => {
          console.log(profile);
          return done(null, { profile: profile });
        }
      )
    );
  }

  //----------------------------------------------routes----------------------------------------------

  // Set up routes for authentication
  setupRoutes() {
    const router = express.Router();

    // Route to initiate Google authentication
    router.get(
      "/google",
      passport.authenticate("google", { scope: ["email", "profile"] })
    );

    // Route to handle Google OAuth callback
    router.get(
      "/google/redirect",
      passport.authenticate("google", { failureRedirect: "/" }),
      (req, res) => {
        res.redirect("/");
      }
    );

    return router;
  }
}

module.exports = Authentication;
