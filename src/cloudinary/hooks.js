const getBeforeDeleteHook = (collection) => {
  return async ({ req, id, doc }) => {
    if (doc?.filename) {
      try {
        const { cloudinary } = require('../cloudinary/config');
        await cloudinary.uploader.destroy(doc.filename);
      } catch (err) {
        req.payload.logger.error(`Error deleting file from Cloudinary: ${err.message}`);
      }
    }
    return doc;
  };
};

const getBeforeChangeHook = (collection) => {
  return async (args) => {
    const { data, req, operation } = args;
    
    if (operation === 'update' && data?.filename) {
      try {
        const existingDoc = await req.payload.findByID({
          collection: collection,
          id: args.id,
        });
        
        if (existingDoc?.filename && existingDoc.filename !== data.filename) {
          const { cloudinary } = require('../cloudinary/config');
          await cloudinary.uploader.destroy(existingDoc.filename);
        }
      } catch (err) {
        req.payload.logger.error(`Error in beforeChange hook: ${err.message}`);
      }
    }
    
    return data;
  };
};

module.exports = {
  getBeforeChangeHook,
  getBeforeDeleteHook,
};
