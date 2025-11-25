function buildLogRocketUserPayload(user) {
  if (!user) return null;

  return {
    id: user.id || user._id || null,
    email: user.email || null,
    name: user.name || null,
    role: user.role || null,
    timestamp_login: new Date().toISOString(),
  };
}

async function trackAdminAction({ action, collection, id, user, req }) {
  const event = {
    action,
    collection,
    id,
    user,
    timestamp: new Date().toISOString(),
  };

  if (req && req.payload && req.payload.logger) {
    req.payload.logger.info({
      msg: 'Admin action for LogRocket tracking',
      event,
    });
  } else {
    console.log('[LogRocket admin event]', event);
  }

  if (req && req.payload) {
    try {
      await req.payload.create({
        collection: 'activity-logs',
        overrideAccess: true,
        data: {
          action,
          collectionSlug: collection,
          recordId: id || null,
          summary: `${action} ${collection} #${id || ''}`.trim(),
          userId: user && user.id ? String(user.id) : null,
          userEmail: user && user.email ? user.email : null,
          userName: user && user.name ? user.name : null,
          userRole: user && user.role ? user.role : null,
          timestamp: event.timestamp,
          raw: event,
        },
      });
    } catch (err) {
      if (req.payload.logger) {
        req.payload.logger.error({
          msg: 'Failed to persist activity log',
          error: err && err.message ? err.message : err,
        });
      } else {
        console.error('[LogRocket admin event] Failed to persist activity log', err);
      }
    }
  }
}

function getAuthHooks() {
  return {
    afterLogin: [
      async ({ req, doc }) => {
        const user = buildLogRocketUserPayload(doc);
        req.logRocketUser = user;
        return doc;
      },
    ],
    afterRefresh: [
      async ({ req, doc }) => {
        const user = buildLogRocketUserPayload(doc);
        req.logRocketUser = user;
        return doc;
      },
    ],
  };
}

function getGlobalHooks() {
  return {
    afterChange: [
      async ({ req, doc, previousDoc, operation, collection }) => {
        const user = buildLogRocketUserPayload(req.user);

        let action = operation;
        if (operation === 'create') action = 'create';
        else if (operation === 'update') action = 'update';

        await trackAdminAction({
          action,
          collection: collection.slug,
          id: doc && (doc.id || doc._id),
          user,
          req,
        });

        return doc;
      },
    ],
    afterDelete: [
      async ({ req, doc, collection }) => {
        const user = buildLogRocketUserPayload(req.user);

        await trackAdminAction({
          action: 'delete',
          collection: collection.slug,
          id: doc && (doc.id || doc._id),
          user,
          req,
        });

        return doc;
      },
    ],
  };
}

function buildCollectionHooks(slug) {
  return {
    afterChange: [
      async ({ req, doc, previousDoc, operation }) => {
        const user = buildLogRocketUserPayload(req.user);

        let action = operation;
        if (operation === 'create') action = 'create';
        else if (operation === 'update') action = 'update';

        await trackAdminAction({
          action,
          collection: slug,
          id: doc && (doc.id || doc._id),
          user,
          req,
        });

        return doc;
      },
    ],
    afterDelete: [
      async ({ req, doc }) => {
        const user = buildLogRocketUserPayload(req.user);

        await trackAdminAction({
          action: 'delete',
          collection: slug,
          id: doc && (doc.id || doc._id),
          user,
          req,
        });

        return doc;
      },
    ],
  };
}

module.exports = {
  buildLogRocketUserPayload,
  trackAdminAction,
  getAuthHooks,
  getGlobalHooks,
  buildCollectionHooks,
};
