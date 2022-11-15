import { useContext } from "react";
import StoriesA from "../../Contexts/StoriesA";

function Line({ story }) {
  const { setEditData, setDeleteData } = useContext(StoriesA);

  const remove = (id) => {
    setDeleteData({ id: story.id });
  };

  const approve = () => {
    setEditData({ id: story.id, status: 1 });
  };

  return (
    <li className="list-group-item">
      <div className="home">
        <div className="home__content">
          <div className="home__content__info">
            {story.image ? (
              <div className="img-bin">
                <img src={story.image} alt={story.title}></img>
              </div>
            ) : (
              <span className="red-image">No image</span>
            )}
          </div>
          <div className="line__content__title">
            <h1>{story.title}</h1>
          </div>
          <div className="line__content__info">Description: {story.text}</div>
          <div className="line__content__info">
            Amount needed: {story.sum} EUR
          </div>
          <div className="line__content__info">
            Status: {story.status ? "Approved" : "Not approved"}
          </div>
          <div className="home__buttons">
            <button
              onClick={approve}
              type="button"
              className="btn btn-outline-danger"
            >
              Approve
            </button>
            <button
              onClick={remove}
              type="button"
              className="btn btn-outline-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Line;
