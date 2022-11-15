import { useContext } from 'react';
import StoriesU from '../../Contexts/StoriesU';

function Line({ story }) {

    const { setDeleteData, setModalData } = useContext(StoriesU);

    return (
        <li className="list-group-item">
            <div className="line">
                <div className="line__content">
                    <div className="line__content__info">
                        {story.image ? <div className='img-bin'>
                            <img src={story.image} alt={story.title}>
                            </img>
                        </div> : <span className="red-image">No image</span>}
                    </div>
                    <div className="line__content__title">
                        <h1>{story.title}</h1>
                    </div>
                    <div className="line__content__info">
                        Description: {story.text}
                    </div>
                    <div className="line__content__info">
                        Amount needed: {story.sum} EUR
                    </div>
                </div>
                <div className="line__buttons">
                    <button onClick={() => setModalData(story)} type="button" className="btn btn-outline-success">Edit</button>
                    <button onClick={() => setDeleteData(story)} type="button" className="btn btn-outline-danger">Delete</button>
                </div>
            </div>
        </li>
    )
}

export default Line;