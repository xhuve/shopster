import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"

const Rating = ({ rating, text }) => {
    const ratingStars = []
    for (let index = 0; index < 5; index++) {
        rating >= index ? ratingStars.push(<FaStar />) : 
        rating === index - 0.5 ? ratingStars.push(<FaStarHalfAlt />) :
        ratingStars.push(<FaRegStar />) 
    }

    return (
        <div className="rating">
            <span>
                {ratingStars.map((x) => x)}
            </span>
            <span className="rating-text">{ text && text }</span>
        </div>
    )
}

export default Rating