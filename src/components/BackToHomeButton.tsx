import { useNavigate } from "react-router";

function BackToHomeButton() {
  const navigate = useNavigate();

  return (
    <button className="self-start" onClick={() => navigate("/home")}>
      &larr;
    </button>
  );
}

export default BackToHomeButton;
