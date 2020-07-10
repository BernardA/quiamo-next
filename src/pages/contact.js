import getCategories from '../lib/getCategories';

const Contact = () => {
    return (
        <div>Contact page</div>
    );
};

export default Contact;

export async function getStaticProps() {
    let categories = await getCategories();
    categories = categories.data.categories;
    return {
        props: {
            categories,
        },
    };
}
