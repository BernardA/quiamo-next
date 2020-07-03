import getCategories from '../../lib/getCategories';

const Search = () => {
    return <h2>Main search page</h2>
}

export default Search;

export async function getServerSideProps() {
    let categories = await getCategories();
    categories = categories.data.categories;
    // const data = await apiQl(queryQl, variables);
    return {
        props: {
            categories,
            // ads: data.data.ads,
        }
    }
}