import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Navbar from "./Navbar";



const Layout = ({ title, content, children }) => {
  return (
    <>
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={content} />
        </Helmet>
        <Navbar />
        <div className="child" style={{marginTop:'25px'}}>
            {children}
        </div>
    </>
  )
}

Layout.propTypes = {
    title: PropTypes.string.isRequired, 
    content: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default Layout