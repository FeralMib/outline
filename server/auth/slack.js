// @flow
import Router from 'koa-router';
import auth from '../middlewares/authentication';
import addHours from 'date-fns/add_hours';
import { stripSubdomain } from '../../shared/utils/domains';
import { slackAuth } from '../../shared/utils/routeHelpers';
import { Authentication, Integration, User, Team } from '../models';
import * as Slack from '../slack';

const router = new Router();

// start the oauth process and redirect user to Slack
router.get('slack', async ctx => {
  const state = Math.random()
    .toString(36)
    .substring(7);

  ctx.cookies.set('state', state, {
    httpOnly: false,
    expires: addHours(new Date(), 1),
    domain: stripSubdomain(ctx.request.hostname),
  });
  ctx.redirect(slackAuth(state));
});

// signin callback from Slack
router.get('slack.callback', auth({ required: false }), async ctx => {
  const { code, error, state } = ctx.request.query;
  ctx.assertPresent(code || error, 'code is required');
  ctx.assertPresent(state, 'state is required');

  if (state !== ctx.cookies.get('state') || error) {
    ctx.redirect(`/?notice=auth-error`);
    return;
  }

  const data = await Slack.oauthAccess(code);

  const [team, isFirstUser] = await Team.findOrCreate({
    where: {
      slackId: data.team.id,
    },
    defaults: {
      name: data.team.name,
      avatarUrl: data.team.image_88,
    },
  });

  const [user] = await User.findOrCreate({
    where: {
      service: 'slack',
      serviceId: data.user.id,
      teamId: team.id,
    },
    defaults: {
      name: data.user.name,
      email: data.user.email,
      isAdmin: isFirstUser,
      avatarUrl: data.user.image_192,
    },
  });

  if (isFirstUser) {
    await team.createFirstCollection(user.id);

    // attempt to give the new team the same subdomain as they use on slack
    try {
      await team.update({ subdomain: data.team.domain });
    } catch (err) {
      // subdomain was invalid or already used
    }
  }

  // set cookies on response and redirect to team subdomain
  ctx.signIn(user, team, 'slack');
});

router.get('slack.commands', auth(), async ctx => {
  const { code, error } = ctx.request.query;
  ctx.assertPresent(code || error, 'code is required');

  if (error) {
    ctx.redirect(`/settings/integrations/slack?error=${error}`);
    return;
  }

  const endpoint = `${process.env.URL || ''}/auth/slack.commands`;
  const data = await Slack.oauthAccess(code, endpoint);
  const user = ctx.state.user;

  const authentication = await Authentication.create({
    service: 'slack',
    userId: user.id,
    teamId: user.teamId,
    token: data.access_token,
    scopes: data.scope.split(','),
  });

  await Integration.create({
    service: 'slack',
    type: 'command',
    userId: user.id,
    teamId: user.teamId,
    authenticationId: authentication.id,
  });

  ctx.redirect('/settings/integrations/slack');
});

router.get('slack.post', auth(), async ctx => {
  const { code, error, state } = ctx.request.query;
  ctx.assertPresent(code || error, 'code is required');

  if (error) {
    ctx.redirect(`/settings/integrations/slack?error=${error}`);
    return;
  }

  const collectionId = state;
  ctx.assertUuid(collectionId, 'collectionId must be an uuid');

  const endpoint = `${process.env.URL || ''}/auth/slack.post`;
  const data = await Slack.oauthAccess(code, endpoint);
  const user = ctx.state.user;

  const authentication = await Authentication.create({
    service: 'slack',
    userId: user.id,
    teamId: user.teamId,
    token: data.access_token,
    scopes: data.scope.split(','),
  });

  await Integration.create({
    service: 'slack',
    type: 'post',
    userId: user.id,
    teamId: user.teamId,
    authenticationId: authentication.id,
    collectionId,
    events: [],
    settings: {
      url: data.incoming_webhook.url,
      channel: data.incoming_webhook.channel,
      channelId: data.incoming_webhook.channel_id,
    },
  });

  ctx.redirect('/settings/integrations/slack');
});

export default router;
