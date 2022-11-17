import { NavLink, useNavigate } from "react-router-dom";
import {useContext} from "react";
import DataContext from "../Contexts/DataContext";

function Nav({ status }) {

  const navigate = useNavigate();
  const { showLinks, setShowLinks } = useContext(DataContext);

  const goHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid">
              <span className="navbar-brand" onClick={goHome} >FundMeApp</span>
              <div className="navbar-collapse">
                <i className="fa fa-bars" onClick={() => setShowLinks(!showLinks)}></i>
                <div className="navbar-nav" id={showLinks ? "hidden" : ""}>
                  {status === 2 || status === 3 || status === 4 ? (
                    <NavLink
                      to="/"
                      end
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                    >
                      Home
                    </NavLink>
                  ) : null}
                  {status === 3 || status ===2 ? (
                    <NavLink
                      to="/storiesUser"
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                    >
                      StoriesUser
                    </NavLink>
                  ) : null}
                  {status === 3 ? (
                    <NavLink
                      to="/storiesAdmin"
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                    >
                      StoriesAdmin
                    </NavLink>
                  ) : null}
                  {status !== 1 ? (
                    <NavLink to="/logout" className="nav-link">
                      Logout
                    </NavLink>
                  ) : null}
                  {status === 1 ? <NavLink to="/register" className="nav-link">Register</NavLink> : null}
                </div>
                
                {/* <button
                  className="menu-btn"
                  onClick={() => setShowLinks(!showLinks)}
                >
                  Menu
                </button> */}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Nav;
