import Home from "../../Contexts/Home";
import List from "./List";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { authConfig } from '../../Functions/auth';
import DataContext from "../../Contexts/DataContext";

function Main() {

        const [lastUpdate, setLastUpdate] = useState(Date.now());
        const [storiesu, setStoriesu] = useState(null);
        const [sumnow, setSumnow] = useState(null);
        const [donation, setDonation] = useState(null);
        const { makeMsg } = useContext(DataContext);

        const reList = data => {
            const d = new Map();
            data.forEach(line => {
                if (d.has(line.title)) {
                    d.set(line.title, [...d.get(line.title), line]);
                } else {
                    d.set(line.title, [line]);
                }
            });
            return [...d];
        }

// READ for list of stories with donations

useEffect(() => {
    axios
      .get("http://localhost:3003/home/stories-home", authConfig())
      .then((res) => {
        console.log(reList(res.data));
        setStoriesu(reList(res.data));
        
      });
  }, [lastUpdate]);

  /// CREATE donation

  useEffect(() => {
    if (null === donation) {
      return;
    }
    axios
      .post("http://localhost:3003/home/donations", donation, authConfig())
      .then((res) => {
        setLastUpdate(Date.now());
        makeMsg(res.data.text, res.data.type);
      });
  }, [donation, makeMsg]);

  // UPDATE STORY

  useEffect(() => {
    if (null === sumnow) {
      return;
    }
    axios
      .put(
        "http://localhost:3003/home/stories-donation/" + sumnow.id, sumnow, authConfig()
      )
      .then((res) => {
        setLastUpdate(Date.now());
        
      });
  }, [sumnow]);

  return (
    <Home.Provider
      value={{
        setDonation,
        storiesu,
        setStoriesu,
        setSumnow,
    }}>
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <List/>
                </div>
            </div>
        </div>
        </Home.Provider>
    );
}

export default Main;