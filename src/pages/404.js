import getCategories from '../lib/getCategories';

export default function Custom404() {
    return <h1>404 - Page Not Found</h1>;
}


export async function getStaticProps() {
    let categories = await getCategories();
    categories = categories.data.categories;
    return {
        props: {
            categories,
        },
    };
}