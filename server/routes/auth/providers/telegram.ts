// @flow
import passport from "@outlinewiki/koa-passport";
import { TelegramStrategy } from "passport-telegram-official";

import Router from "koa-router";
import accountProvisioner from "../../../commands/accountProvisioner";
import env from "../../../env";
// import { TelegramError } from "../../../errors";
import passportMiddleware from "../../../middlewares/passport";
import { StateStore } from "../../../utils/passport";

const router = new Router();
const providerName = "telegram";
const TELEGRAM_BOT_NAME = env.TELEGRAM_BOT_NAME;
const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;

var token_data = "";
if (TELEGRAM_BOT_TOKEN) {
  token_data = TELEGRAM_BOT_TOKEN.split(':')[0];
}

export const config = {
  name: 'Telegram',
  enabled: !!TELEGRAM_BOT_TOKEN,
  data: token_data,
};

if (TELEGRAM_BOT_TOKEN) {
  const strategy = new TelegramStrategy(
    {
      botToken: TELEGRAM_BOT_TOKEN,
      passReqToCallback: true,
    },
    async function (req, profile, done) {
      try {
        // console.log(profile); 
        var name = profile.username;
        var email = (profile.first_name + "_" + profile.last_name + "@local.net").replace(/ /g, "_");
        if (!name) {
          name = email;
        }
        // Telegram doesn't provide details about groups the user is in,
        // So just select the first configured ALLOWED_DOMAINS
        var team = env.ALLOWED_DOMAINS?.split(",")[0].trim();
        var result = result = await accountProvisioner({
          ip: req.ip,
          team: {
            name: team,
            domain: team,
          },
          user: {
            name: name,
            email: email,
          },
          authenticationProvider: {
            name: providerName,
            providerId: providerName,
          },
          authentication: {
            providerId: profile.id,
          },
        });
        done(null, result.user, result);
      } catch (err) {
        return done(err, null);
      }
    }
  );

  // TelegramStrategy assumes that a POST request will not have the query in the args,
  // But koa-passport always seems to forward requests on as POST.

  function override(object, methodName, callback) {
    object[methodName] = callback(object[methodName])
  }

  override(strategy, 'authenticate', function (original) {
    return function (req, options) {
      if (req.body.auth_date) {
        req.method = 'POST';
      }
      if (req.query.auth_date) {
        req.method = 'GET';
      }
      return original.apply(this, arguments);
    }
  })

  strategy.error = function (err) {
    console.log(err);
    throw new new Error(err);
  }

  passport.use(strategy);
  router.get("telegram", passportMiddleware(providerName));
}

export default router;
