// pages/NotFound.jsx
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-20 text-20 font-bold text-red-600">
      404 - Page Not Found
      <div className="mt-4">
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate('/')}
        >
          Go To Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
