import Layout from "../components/Layout";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
// import axiosInstance from '../context/AxiosInstance';
import { BASE_URL } from '../context/Constants';
import SaveModal from "../components/SaveModal";
import "./Home.css";

const Home = () => {
  const { user } = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");
  const [copyButtonClicked, setCopyButtonClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [body, setBody] = useState({
    p_length: "",
    cap_length: "",
    num_length: "",
    schar_length: "",
  });

  const onChange = (e) => {
    setBody({ ...body, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setCopyButtonClicked(false);

    axios.post(`${BASE_URL}/api/user/generate/`, body, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status === 201) {
          // Registration successful
          console.log('User registered successfully');
          const data = response.data
          setPassword(data.password)
        } else {
          // Handle any other responses, e.g., validation errors
        }
      })
      .catch((error) => {
        // Handle any network or request errors
        setErrors({ message: error.response.data.error });
        console.error('Error registering user:', error);
      });
  };

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = password;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    // Set the copy button clicked state to true
    setCopyButtonClicked(true);
  };

  return (
    <Layout title="Pagen | Home" content="Homepage">

      <SaveModal isVisible={showModal} onClose={() => setShowModal(false)} generatedPassword={password} />
      <h3 style={{color:'white'}}>{user ? `Hello ${user.first_name}` : ""}</h3>
      <div className="container">
        <div className="header">
          <h1>Password Generator</h1>
          <h3>Generate secure passwords here:</h3>
          <br />
          <hr />
          <h4>Select desired password length between 8 and 36 characters.</h4>
          {errors.message && <p style={{color:"crimson"}}>Error: {errors.message}</p>}
        </div>
        <form onSubmit={onSubmit}>
          <div id="password-requirements" className="input-container">
            <div className="fields">
              <label htmlFor="p_length">Password Length:</label>&nbsp;
              <input type="number" id="p_length" name="p_length" value={body.p_length} onChange={onChange} min="1" max="36" maxLength="2" required />&nbsp;
            </div>
            <div className="fields">
            <label htmlFor="cap_length">Capital Letters:</label>&nbsp;
            <input type="number" id="cap_length" name="cap_length" value={body.cap_length} onChange={onChange} min="0" max="15" maxLength="2" required/>
            </div>
            <br />
            <br />
            <div className="fields">
            <label htmlFor="num_length">Numerals:</label>&nbsp;
            <input type="number" id="num_length" name="num_length" value={body.num_length} onChange={onChange} min="0" max="15" maxLength="2" required/> &nbsp;
            </div>
            <div className="fields">
            <label htmlFor="schar_length">Special Characters:</label>&nbsp;
            <input type="number" id="schar_length" name="schar_length" value={body.schar_length} onChange={onChange} min="0" max="15" maxLength="2" required />
            </div>
          </div>
          <button className="btn" type="submit">Generate Password</button>
        </form>
        <br />
        <hr/>
        <div className="password-container">
          {password && (
            <div className="password-box">
              <p>Generated Password:</p>
              <div className="gray-div">{password}</div>
              <button
              className={`copy-button ${copyButtonClicked ? "clicked" : ""}`}
              onClick={copyToClipboard}
            >
              {copyButtonClicked ? "Copied!" : "Copy"}
            </button>
            <br />
            { user ? (<button
              className="btn"
              onClick={()=>{setShowModal(true)}}
            >
              Save
            </button>): "" }
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
