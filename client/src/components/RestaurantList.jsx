import React,{useContext, useEffect}  from "react";
import { useHistory } from "react-router";
import RestaurantFinder from "../apis/RestaurantFinder";
import { RestaurantsContext } from "../context/RestaurantsContext";
import StarRating from "./StarRating";

const RestaurantList = () => {
    const { restaurants, setRestaurants } = useContext(RestaurantsContext)
    let history = useHistory()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await  RestaurantFinder.get("/")
                setRestaurants(response.data.data.restaurants);
      
              }catch(err) {
      
              }
        }
       fetchData();
    }, [])
    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            
           const response = await RestaurantFinder.delete(`/${id}`);
           setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
           
        }catch(err) {
            console.log(err)
        }
    }

    const handleUpdate = (e, id) => {
        e.stopPropagation();
        history.push(`/restaurants/${id}/update`);
    }

    const handleRestaurantSelect = (id) => {
        history.push(`/restaurants/${id}`)
        
    }

    const renderRating = (restaurant) => {
        if(!restaurant.count) {
            return <span className="text-warning">0 reviews</span>
        }
        return(
            <>
                <StarRating rating={restaurant.average_rating} />
                <span className="text-warning ml-1">({restaurant.count})</span>
            </>
        )
    }

    return(
        <div className="list-group">
            <table className="table table-hover table-dark">
                <thead>
                    <tr className="bg-primary">
                        <th scope="col">Restaurant</th>
                        <th scope="col">Location</th>
                        <th scope="col">Price Range</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants && restaurants.map(el => {
                       
                       return(
                        <tr onClick={() => handleRestaurantSelect(el.id)} key={el.id}>
                            <td>{el.name}</td>
                            <td>{el.location}</td>
                            <td>{"$".repeat(el.price_range)}</td>
                            <td>{renderRating(el)}</td>
                            <td><button onClick={(e) => handleUpdate(e, el.id)} className="btn btn-warning">Update</button></td>
                            <td><button className="btn btn-danger" onClick={(e) => handleDelete(e, el.id)}>Delete</button></td>
                        </tr>
                       )
                    })}
                    {/* <tr>
                        <td>mcdonalds</td>
                        <td>New York</td>
                        <td>$$</td>
                        <td></td>
                        <td><button className="btn btn-warning">Update</button></td>
                        <td><button className="btn btn-danger">Delete</button></td>
                    </tr>
                    <tr>
                        <td>mcdonalds</td>
                        <td>New York</td>
                        <td>$$</td>
                        <td></td>
                        <td><button className="btn btn-warning">Update</button></td>
                        <td><button className="btn btn-danger">Delete</button></td>
                    </tr> */}
                </tbody>
            </table>
        </div>
    )
}

export default RestaurantList;