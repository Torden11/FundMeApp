import { useState, useContext, useRef } from 'react';
import DataContext from '../../Contexts/DataContext';
import StoriesU from '../../Contexts/StoriesU';
import getBase64 from '../../Functions/getBase64';

function Create() {

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [sum, setSum] = useState('');
    const [photoPrint, setPhotoPrint] = useState(null);
    const fileInput = useRef();

    const { setCreateData } = useContext(StoriesU);
    const {makeMsg} = useContext(DataContext);

    

    const doPhoto = () => {
        getBase64(fileInput.current.files[0])
            .then(photo => setPhotoPrint(photo))
            .catch(_ => {
                // tylim
            })
    }

    const add = () => {

        if (title.length === 0 || title.length > 50) {
            makeMsg('Invalid title', 'error');
            return;
        }
        if (text.length === 0 || text.length > 250) {
            makeMsg('Invalid text message. Please use up to 250 symbols.', 'error');
            return;
        }
        if (sum.replace(/[^\d.]/, '') !== sum) {
            makeMsg('Invalid sum', 'error');
            return;
        }
        if (parseFloat(sum) > 100000) {
            makeMsg('Max sum is 100000', 'error');
            return;
        }
        setCreateData({
            title,
            text,
            sum: Number(sum),
            sum_balance: Number(sum),
            image: photoPrint
        });
        setTitle('');
        setText('');
        setSum('');
        setPhotoPrint(null);
        fileInput.current.value = null;
    }

    return (
        <div className="card m-4 col-lg-4 col-md-12">
            <h5 className="card-header">New Story</h5>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Story title</label>
                    <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Story text</label>
                    <input type="text" className="form-control" value={text} onChange={e => setText(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Story Sum</label>
                    <input type="text" className="form-control" value={sum} onChange={e => setSum(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Story Image</label>
                    <input ref={fileInput} type="file" className="form-control" onChange={doPhoto} />
                </div>
                {photoPrint ? <div className='img-bin'><img src={photoPrint} alt="upload"></img></div> : null}
                <button onClick={add} type="button" className="btn btn-outline-success">Add</button>
            </div>
        </div>
    );
}

export default Create;