import axios from 'axios';

const queryQl = `query getCities {
    collectionQueryAddresses {
        city
    }
}`;

const apiQl = (data, variables = null) => {
    return axios
        .post(process.env.NEXT_PUBLIC_API_GRAPHQL_URL, {
            query: data,
            variables,
        })
        .then((response) => {
            return response.data;
        });
};

const variables = {};

export default async function getCities() {
    const cities = await apiQl(queryQl, variables);
    return cities;
}