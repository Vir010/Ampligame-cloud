/**
 * library-item router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::library-item.library-item', {
  only: ['find', 'findOne'],
});
