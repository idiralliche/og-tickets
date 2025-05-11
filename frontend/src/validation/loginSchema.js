import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required("L'email est requis")
    .email('Adresse email invalide')
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
      "L'email doit être au format valide, par exemple user@example.com"
    ),
  password: Yup.string().required('Le mot de passe est requis'),
});

export default loginSchema;
