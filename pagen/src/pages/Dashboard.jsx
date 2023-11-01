import Layout from "../components/Layout";
import "./Dashboard.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getSavedPassword, deleteSavedPassword } from "../features/pass";
import SaveModal from "../components/SaveModal";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [passwords, setPasswords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const [pass, setPass] = useState("");

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
  }, [user, showModal]);

  const handleEdit = (id, password) => {
    setId(id);
    setPass(password);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this password?"
    );
    if (confirmDelete) {
      deleteSavedPassword(id).then((response) => {
        if (response.status === 204) {
          console.log(response.data);
          setPasswords((prevPasswords) =>
            prevPasswords.filter((item) => item.id !== id)
          );
        } else {
          // Handle any other responses, e.g., validation errors
        }
      });
    }
  };

  return (
    <Layout title="Pagen | Dashboard" content="Dashboardpage">
      <SaveModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        generatedPassword={pass}
        id={id}
      />
      {user ? (
        <div className="cont">
          <h3 style={{ color: "white" }}>
            {user ? `Hello ${user.first_name}` : ""}
          </h3>
          <h4>Find your saved passwords below.</h4>
          <table className="centered-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Title</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {passwords.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td> {/* Auto-generated index */}
                  <td>{item.title}</td>
                  <td>{item.password}</td>
                  <td>
                    <button
                      className="btn-dash edit"
                      onClick={() => handleEdit(item.id, item.password)}
                    >
                      <span className="material-symbols-outlined">
                        border_color
                      </span>
                    </button>{" "}
                    &nbsp;{" "}
                    <button
                      className="btn-dash delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
};

export default Dashboard;
