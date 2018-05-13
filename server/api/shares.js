// @flow
import Router from 'koa-router';
import auth from './middlewares/authentication';
import pagination from './middlewares/pagination';
import { presentShare } from '../presenters';
import { Document, User, Share } from '../models';
import policy from '../policies';

const { authorize } = policy;
const router = new Router();

router.post('shares.list', auth(), pagination(), async ctx => {
  let { sort = 'updatedAt', direction } = ctx.body;
  if (direction !== 'ASC') direction = 'DESC';

  const user = ctx.state.user;
  const shares = await Share.findAll({
    where: { teamId: user.teamId },
    order: [[sort, direction]],
    include: [
      {
        model: Document,
        required: true,
        as: 'document',
      },
      {
        model: User,
        required: true,
        as: 'user',
      },
    ],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit,
  });

  const data = await Promise.all(shares.map(share => presentShare(ctx, share)));

  ctx.body = {
    data,
  };
});

router.post('shares.create', auth(), async ctx => {
  const { id } = ctx.body;
  ctx.assertPresent(id, 'id is required');

  const user = ctx.state.user;
  const document = await Document.findById(id);
  authorize(user, 'share', document);

  const share = await Share.create({
    documentId: document.id,
    userId: user.id,
    teamId: user.teamId,
  });
  share.user = user;
  share.document = document;

  ctx.body = {
    data: presentShare(ctx, share),
  };
});

export default router;
