import * as Yup from 'yup';

/**
 * Schema for validating the creation of a new CartItem.
 * @constant {Yup.ObjectSchema}
 */
export const newCartItemSchema = Yup.object().shape({
  /**
   * ID of the offer.
   * @type {Yup.NumberSchema}
   */
  offer: Yup.number()
    .positive('L’ID de l’offre doit être un nombre positif')
    .required('L’ID de l’offre est requis'),

  /**
   * ID of the Olympic event.
   * @type {Yup.NumberSchema}
   */
  olympic_event: Yup.number()
    .positive('L’ID de l’événement doit être un nombre positif')
    .required('L’ID de l’événement est requis'),

  /**
   * Quantity of the offer.
   * @type {Yup.NumberSchema}
   */
  quantity: Yup.number()
    .integer('La quantité doit être un entier')
    .positive('La quantité doit être strictement positive')
    .required('La quantité est requise'),

  /**
   * Total amount for the offer.
   * @type {Yup.NumberSchema}
   */
  amount: Yup.number()
    .positive('Le montant total doit être positif')
    .required('Le montant est requis'),
});

/**
 * Schema for validating the update of an existing CartItem.
 * @constant {Yup.ObjectSchema}
 */
export const updateCartItemSchema = Yup.object().shape({
  /**
   * Quantity of the offer.
   * @type {Yup.NumberSchema}
   */
  quantity: Yup.number()
    .integer('La quantité doit être un entier')
    .min(0, 'La quantité ne peut pas être négative')
    .required('La quantité est requise'),
});
