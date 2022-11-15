import { useContext } from 'react';
import StoriesA from "../../Contexts/StoriesA";
import Line from './Line';


function List() {

    const { storiesu } = useContext(StoriesA);
    

    return (
        <div className="card m-4">
            <h5 className="card-header">Stories List</h5>
            <div className="card-body">
                <ul className="list-group">
                    {
                        storiesu?.map(s => <Line key={s.id} story={s} />)
                    }
                </ul>
            </div>
        </div>
    );
}

export default List;