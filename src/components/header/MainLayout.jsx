// components/Layout.jsx
import Header from "./index";

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;