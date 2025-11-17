const ServicesBlock = require('../blocks/ServicesBlock').ServicesBlock;
const FeaturedProductsBlock = require('../blocks/FeaturedProductsBlock').FeaturedProductsBlock;

exports.TestGlobal = {
  slug: 'test-global',
  label: 'Test Global',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
    {
      name: 'content',
      type: 'blocks',
      label: 'Content',
      blocks: [
        ServicesBlock,
        FeaturedProductsBlock,
      ],
    },
  ],
};
