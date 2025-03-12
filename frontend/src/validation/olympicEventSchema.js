import * as Yup from 'yup';

const olympicEventSchema = Yup.object().shape({
    sport: Yup.string().trim().required('Le sport est requis'),
    name: Yup.string().trim().required('Le nom de l’épreuve est requis'),
    date_time: Yup.date()
        .required('La date et heure sont requises')
        .typeError('La date est invalide'),
    location: Yup.string().trim().required('Le lieu est requis'),
    description: Yup.string(), // not required
});

export default olympicEventSchema;
