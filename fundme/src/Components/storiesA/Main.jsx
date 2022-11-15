import StoriesA from "../../Contexts/StoriesA";
import List from "./List";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { authConfig } from '../../Functions/auth';
import DataContext from "../../Contexts/DataContext";

function Main() {

    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [storiesu, setStoriesu] = useState(null);
    const [deleteData, setDeleteData] = useState(null);
    const [editData, setEditData] = useState(null);
    const { makeMsg } = useContext(DataContext);

    
    // READ for list
    useEffect(() => {
        axios.get('http://localhost:3003/home/storiesa', authConfig())
            .then(res => {
                setStoriesu(res.data);
               
            })
    }, [lastUpdate]);

    // UPDATE a story

  useEffect(() => {
    if (null === editData) {
      return;
    }
    axios
      .put(
        "http://localhost:3003/home/storiesa/" + editData.id,
        editData,
        authConfig()
      )
      .then((res) => {
        setLastUpdate(Date.now());
        makeMsg(res.data.text, res.data.type);
      });
  }, [editData, makeMsg]);

  /// DELETE a story

  useEffect(() => {
    if (null === deleteData) {
      return;
    }
    axios
      .delete(
        "http://localhost:3003/home/stories/" + deleteData.id,
        authConfig()
      )
      .then((res) => {
        setLastUpdate(Date.now());
        makeMsg(res.data.text, res.data.type);
      });
  }, [deleteData, makeMsg]);

    return (
        <StoriesA.Provider value={{
        setStoriesu,
        storiesu,
        editData,
        setEditData,
        deleteData,
        setDeleteData,
        }}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <List />
                    </div>
                </div>
            </div>
        </StoriesA.Provider>
    );
}

export default Main;