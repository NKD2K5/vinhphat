const express = require('express');
const jwt = require('jsonwebtoken');

function registerOauthRoutes(app, payload) {
  const router = express.Router();

  router.post('/oauth-login', express.json(), async (req, res) => {
    try {
      const { email, name, image, googleId } = req.body || {};

      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      // 1. Tìm user theo googleId hoặc email
      let userDoc = null;

      if (googleId) {
        const byGoogle = await payload.find({
          collection: 'users',
          where: {
            googleId: {
              equals: googleId,
            },
          },
          limit: 1,
        });

        if (byGoogle?.docs?.length) {
          userDoc = byGoogle.docs[0];
        }
      }

      if (!userDoc) {
        const byEmail = await payload.find({
          collection: 'users',
          where: {
            email: {
              equals: email,
            },
          },
          limit: 1,
        });

        if (byEmail?.docs?.length) {
          userDoc = byEmail.docs[0];
        }
      }

      // 2. Nếu chưa có user thì tạo mới
      if (!userDoc) {
        const createData = {
          email,
          name: name || email,
          role: 'admin',
          googleId: googleId || null,
          avatarUrl: image || null,
        };

        userDoc = await payload.create({
          collection: 'users',
          data: createData,
        });
      } else {
        // 3. Đồng bộ name/avatar/googleId nếu có thay đổi
        const updateData = {};

        if (name && name !== userDoc.name) updateData.name = name;
        if (image && image !== userDoc.avatarUrl) updateData.avatarUrl = image;
        if (googleId && googleId !== userDoc.googleId) updateData.googleId = googleId;

        if (Object.keys(updateData).length > 0) {
          userDoc = await payload.update({
            collection: 'users',
            id: userDoc.id,
            data: updateData,
          });
        }
      }

      // 4. Tạo JWT tương thích Payload cho user này
      let token = null;
      try {
        const secret = process.env.PAYLOAD_SECRET || 'your-super-secret-payload-secret-here';
        token = jwt.sign(
          {
            id: userDoc.id,
            email: userDoc.email,
            collection: 'users',
            role: userDoc.role,
          },
          secret,
          { expiresIn: '7d' }
        );
      } catch (err) {
        if (payload.logger) {
          payload.logger.error({
            msg: 'Failed to sign OAuth JWT',
            error: err?.message || err,
          });
        } else {
          console.error('Failed to sign OAuth JWT', err);
        }
      }

      return res.json({
        success: true,
        user: {
          id: userDoc.id,
          email: userDoc.email,
          name: userDoc.name,
          role: userDoc.role,
          avatarUrl: userDoc.avatarUrl,
        },
        token,
      });
    } catch (error) {
      if (payload.logger) {
        payload.logger.error({
          msg: 'OAuth login failed',
          error: error?.message || error,
        });
      } else {
        console.error('OAuth login failed', error);
      }

      return res.status(500).json({
        success: false,
        message: 'OAuth login failed',
      });
    }
  });

  app.use(router);
}

module.exports = registerOauthRoutes;
