import {  useContext } from 'react';
import Home from "../../Contexts/Home";
import Line from './Line';

// const sortData = [
//     { v: 'default', t: 'Default' },
//     { v: 'price_asc', t: 'Price 1-9' },
//     { v: 'price_desc', t: 'Price 9-1' },
//     { v: 'rate_asc', t: 'Rating 1-9' },
//     { v: 'rate_desc', t: 'Rating 9-1' }
// ];

function List() {

    const { storiesu } = useContext(Home);

    // const { storiesu, setStoriesu } = useContext(Home);

    // const [sortBy, setSortBy] = useState('default');
    // const [stats, setStats] = useState({movieCount: null});

    

    // useEffect(() => {
    //     if (null === storiesu) {
    //         return;
    //     }
    //     setStats(s => ({...s, movieCount: storiesu.length}));
    // }, [storiesu]);

    // useEffect(() => {
    //     switch (sortBy) {
    //         case 'price_asc':
    //             setStoriesu(m => [...m].sort((a, b) => a[1][0].price - b[1][0].price));
    //             break;
    //         case 'price_desc':
    //             setStoriesu(m => [...m].sort((b, a) => a[1][0].price - b[1][0].price));
    //             break;
    //         case 'rate_asc':
    //             setStoriesu(m => [...m].sort((x, c) => x[1][0].rating - c[1][0].rating));
    //             break;
    //         case 'rate_desc':
    //             setStoriesu(m => [...m].sort((jo, no) => no[1][0].rating - jo[1][0].rating));
    //             break;
    //         default:
    //             setStoriesu(m => [...m ?? []].sort((a, b) => a.row - b.row));
    //     }

    // }, [sortBy, setStoriesu]);

    return (
        <>
            {/* <div className="card m-4">
                <h5 className="card-header">Sort</h5>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Sort By</label>
                        <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            {
                                sortData.map(c => <option key={c.v} value={c.v}>{c.t}</option>)
                            }
                        </select>
                    </div>
                </div>
            </div> */}
            <div className="card m-4">
                <h5 className="card-header">Members stories</h5>
                <div className="card-body">
                    <ul className="list-group">
                        {
                            storiesu?.map(s => <Line key={s[1][0].id} story={s} />)
                        }
                    </ul>
                </div>
            </div>
        </>
    );
}

export default List;