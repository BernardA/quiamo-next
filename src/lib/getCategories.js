import axios from 'axios';

const queryQl = `query getCategories {
    categories {
        id
        title
        parent {
            id
            title
        }
        root {
            id
            title
        }
    }
}`;

const apiQl = (data, variables = null) => {
    return axios
        .post(process.env.API_GRAPHQL_URL, {
            query: data,
            variables,
        })
        .then((response) => {
            return response.data;
        });
};

const variables = {};

export default async function getCategories() {
    const categories = await apiQl(queryQl, variables);
    return categories;
}