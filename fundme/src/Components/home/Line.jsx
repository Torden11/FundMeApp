import { useContext, useState } from "react";
import Home from "../../Contexts/Home";
import DataContext from "../../Contexts/DataContext";

function Line({ story }) {
  const { setSumnow, setDonation } = useContext(Home);
  const { makeMsg } = useContext(DataContext);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const add = () => {
    if (name === "" || name.length < 2 || name.length > 30) {
      makeMsg("Please put your name");
      return;
    }
    if (amount === String || amount < 1 || amount > 100000) {
      makeMsg("Minimum donation is 1 Eur and maximum donation is 100000 Eur");
      return;
    }
    if (amount > story[1][0].sum_balance) {
      makeMsg(
        "Thank you for you support!. However we are expecting a smaller donation from you."
      );
      return;
    }
    setDonation({
      name,
      amount: Number(amount),
      story_id: story[1][0].id,
    });
    setSumnow({
      id: story[1][0].id,
      amount: Number(amount),
    });
    setAmount("");
    setName("");
  };

  return (
    <li className="list-group-item">
      <div className="home">
        <div className="home__content">
          <div className="home__content__info">
            {story[1][0].image ? (
              <div className="img-bin">
                <img src={story[1][0].image} alt={story[0]}></img>
              </div>
            ) : (
              <div className="red-image">No image</div>
            )}
            <h1>{story[0]}</h1>
            <h2>{story[1][0].text}</h2>
            
          </div>
          <div className="home__content__price">
            We expect to raise: {story[1][0].sum} Eur
            
            
          </div>
          <div className="home__content__price">
            Raised so far: {story[1][0].sum_now ?? "not yet any donation"} Eur
          </div>
          <div className="home__content__price">
            Left to collect: {story[1][0].sum_balance} Eur
          </div>

          <div className="home__content__cat">
            <h4>Already helped us:</h4>
            <ul className="list-group list-group-flush">
              {story[1]?.map((l) =>
                l.lid !== null ? (
                  <li key={l.lid} className="list-group-item list-group-item-info">
                    <div className="home__content__cat">
                      {l.name} has donated:
                    </div>
                    <div className="home__content__cat">{l.amount} Eur</div>
                  </li>
                ) : null
              )}
            </ul>
            <div className="mb-3">
              <h4 className="form-label">Donate for this story:</h4>
              <label className="input-label">Your name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="input-label">
                Amount you are willing to donate:{" "}
              </label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button
              onClick={add}
              type="button"
              className="btn btn-outline-success"
            >
              Donate
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Line;
