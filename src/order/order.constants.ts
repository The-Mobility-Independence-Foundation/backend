/**
 * The default relations to get all necessary order information
 * for the frontend.
 */
export const DEFAULT_ORDER_RELATIONS = {
  relations: {
    listing: {
      inventoryItem: {
        part: true,
        model: true,
      },
    },
    recipient: true,
    providerOrganization: true,
  },
};
