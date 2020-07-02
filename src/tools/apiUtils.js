export const parseApiErrors = (violations) => {
    return violations.reduce((parsedErrors, violation, index) => {
        const parsedE = parsedErrors;
        const property = violation.propertyPath;
        const message = violation.message;
        parsedE[index] = {
            [property]: message,
        };
        return parsedE;
    }, []);
};

export const hydraPageCount = (collection) => {
    if (!collection['hydra:view']) {
        return 1;
    }

    return Number(
        collection['hydra:view']['hydra:last'].match(/page=(\d+)/)[1],
    );
};

const canWriteBlogPostRoles = ['ROLE_WRITER', 'ROLE_ADMIN', 'ROLE_SUPERADMIN'];

export const canWriteBlogPost = (userData) => {
    return (
        userData !== null &&
        userData.roles.some((userRoles) =>
            canWriteBlogPostRoles.includes(userRoles),
        )
    );
};
