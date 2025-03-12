import * as Yup from 'yup';

const offerSchema = Yup.object().shape({
  name: Yup.string().trim().required('Le nom de l’offre est requise'),
  price: Yup.number()
    .positive('Le prix doit être positif')
    .required('Le prix est requis'),
  description: Yup.string(), // not required
});

export default offerSchema;
