// @flow
import passport from "@outlinewiki/koa-passport";
import { Strategy as DiscordStrategy } from "passport-discord";

import fetch from "fetch-with-proxy";
// import jwt from "jsonwebtoken";
import Router from "koa-router";
import accountProvisioner from "@server/commands/accountProvisioner";
import env from "@server/env";
// import { DiscordError } from "../../../errors";
import passportMiddleware from "@server/middlewares/passport";
import { StateStore } from "@server/utils/passport";

const router = new Router();
const providerName = "discord";
const DISCORD_CLIENT_ID = env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = env.DISCORD_CLIENT_SECRET;

const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

export async function request(endpoint: string, accessToken: string) {
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export const config = {
  name: "Discord",
  enabled: !!DISCORD_CLIENT_ID,
};

if (DISCORD_CLIENT_ID) {
  const strategy = new DiscordStrategy(
    {
      clientID: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
      callbackURL: `${env.URL}/auth/discord.callback`,
      passReqToCallback: true,
      store: new StateStore(),
      scope: scopes,
    },
    async function (req, accessToken, refreshToken, profile, done) {
      try {
        var result = null;

        // Discord doesn't provide suitable details about groups the user is in,
        // So just select the first configured ALLOWED_DOMAINS
        var team = env.ALLOWED_DOMAINS?.split(",")[0].trim();

        result = await accountProvisioner({
          ip: req.ip,
          team: {
            name: team,
            domain: team,
            // May be needed to set up new server
            // id: team,
            // subdomain: team,
          },
          user: {
            name: profile.username,
            email: profile.email,
            // avatarUrl: profile.avatar,
          },
          authenticationProvider: {
            name: providerName,
            providerId: providerName,
          },
          authentication: {
            providerId: profile.id,
            accessToken,
            refreshToken,
            scopes,
          },
        });
        done(null, result.user, result);
      } catch (err) {
        return done(err, null);
      }
    }
  );

  passport.use(strategy);

  router.get("discord", passport.authenticate(providerName));

  router.get("discord.callback", passportMiddleware(providerName));
}

export default router;
