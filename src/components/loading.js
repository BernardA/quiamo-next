/* eslint-disable react/prop-types */
// import LoadingSVG from '../images/circles.svg';
// import { LOADING_INDICATOR_IMG } from '../parameters';


export const LoadingVisibility = (props) => {
    if (props.pastDelay) {
        return (
            <div className="loading_indicator">
                Loading...
                { /* <img src={LoadingSVG} alt="loading" /> */ }
            </div>
        );
    }
    return null;
};

export const Loading = () => {
    return (
        <div className="loading_indicator">
            Loading...
            {/* <img src={LoadingSVG} alt="loading" /> */}
        </div>
    );
};
