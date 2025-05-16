import * as Yup from 'yup';

const registerSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('Le prénom est requis')
    .matches(
      /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/,
      'Le prénom contient des caractères invalides'
    ),
  last_name: Yup.string()
    .required('Le nom est requis')
    .matches(
      /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/,
      'Le nom contient des caractères invalides'
    ),
  email: Yup.string()
    .required("L'email est requis")
    .email('Adresse email invalide')
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
      "L'email doit être au format valide, par exemple user@example.com"
    ),
  password: Yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .required('Le mot de passe est requis')
    .matches(/[a-z]/, 'Le mot de passe doit contenir une minuscule')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir une majuscule')
    .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  re_password: Yup.string()
    .oneOf(
      [Yup.ref('password'), null],
      'Les mots de passe doivent correspondre'
    )
    .required('La confirmation du mot de passe est requise'),
});

export default registerSchema;
