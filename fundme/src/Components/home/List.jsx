import { useContext } from "react";
import Home from "../../Contexts/Home";
import Line from "./Line";

function List() {
  const { storiesu } = useContext(Home);

  return (
    <>
      <div className="card m-4">
        <h5 className="card-header">Members stories</h5>
        <div className="card-body">
          <ul className="list-group">
            {storiesu?.map((s) => (
              <Line key={s[1][0].id} story={s} />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default List;
