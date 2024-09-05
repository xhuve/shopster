import { Spinner } from "react-bootstrap";

const Loader = ({ widthSize = "80px", heightSize = "80px" }) => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: widthSize,
        height: heightSize,
        margin: "auto",
        display: "block",
      }}
    ></Spinner>
  );
};

export default Loader;
