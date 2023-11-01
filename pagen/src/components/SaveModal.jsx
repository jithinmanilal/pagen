import { useContext, useEffect, useState } from "react";
import "./SaveModal.css";
import PropTypes from "prop-types";
import {
  createSavedPassword,
  getSavedPassword,
  updateSavedPassword,
} from "../features/pass";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const SaveModal = ({ isVisible, onClose, generatedPassword, id = null }) => {
  const { user } = useContext(UserContext);
  const [passwords, setPasswords] = useState([]);
  const [pass, setPass] = useState(generatedPassword);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [selectedSavedPasswordId, setSelectedSavedPasswordId] = useState(id);
  const [title, setTitle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      getSavedPassword().then((response) => {
        if (response.status === 200) {
          const data = response.data;
          setPasswords(data);
        } else {
          // Handle any other responses, e.g., validation errors
        }
      });
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    setPass(generatedPassword);
  }, [generatedPassword]);

  useEffect(() => {
    if (selectedSavedPasswordId !== null) {
      // Set the selected password when 'id' is provided
      const selected = passwords.find((password) => password.id === selectedSavedPasswordId);
      if (selected) {
        setSelectedPassword(selected.title);
      }
    }
  }, [selectedSavedPasswordId, passwords]);  

  const onSubmit = () => {
    if (selectedSavedPasswordId) {
      const body = {
        ...(selectedPassword && { title: selectedPassword.title }),
        password: pass,
      };

      updateSavedPassword(selectedSavedPasswordId, body).then((response) => {
        if (response.status === 200) {
          onClose();
          navigate("/dashboard");
        } else {
          // Handle any other responses, e.g., validation errors
        }
      });
    } else {
      const body = {
        title: title,
        password: pass,
      };
      createSavedPassword(body).then((response) => {
        if (response.status === 201) {
          onClose();
          navigate("/dashboard");
        } else {
          // Handle any other responses, e.g., validation errors
        }
      });
    }
  };

  const handleClose = (e) => {
    if (e.target.id === "wrapper") onClose();
  };

  if (!isVisible) return null;

  return (
    <div id="wrapper" className="" onClick={handleClose}>
      <div className="modal-content">
        <div className="top-right-button">
          <button onClick={onClose} className="close-button">
            X
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={onSubmit}>
            <h2 className="text-white text-lg">Save your Password</h2>
            <div className="flex flex-wrap">
              <select
                value={selectedSavedPasswordId}
                onChange={(e) => setSelectedSavedPasswordId(e.target.value)}
              >
                <option value={""}>Create New Password</option>
                {passwords.map((password) => (
                  <option key={password.id} value={password.id}>
                    {password.title}
                  </option>
                ))}
              </select>
            </div>
            {selectedPassword ? (
              // Render fields to update an existing password
              <>
                <input
                  type="text"
                  placeholder="Password Name"
                  defaultValue={selectedPassword}
                />
                <input
                  type="text"
                  placeholder="Password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </>
            ) : (
              // Render fields to create a new password
              <>
                <input
                  type="text"
                  placeholder="Password Name"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </>
            )}
            <button type="submit" className="submit-button">
              {selectedPassword ? "Update Password" : "Save Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

SaveModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  generatedPassword: PropTypes.string.isRequired,
  id: PropTypes.number, // You can adjust the PropTypes as needed
};

export default SaveModal;
