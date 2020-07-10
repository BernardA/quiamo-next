import getCategories from '../lib/getCategories';

const Legal = () => {
    return <div>Legal page</div>;
};

export default Legal;

export async function getStaticProps() {
    let categories = await getCategories();
    categories = categories.data.categories;
    return {
        props: {
            categories,
        },
    };
}
