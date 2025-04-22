import { useNavigate } from "react-router";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button className="self-start" onClick={() => navigate(-1)}>
      &larr;
    </button>
  );
}

export default BackButton;
