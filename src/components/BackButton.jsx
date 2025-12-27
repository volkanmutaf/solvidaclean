// src/components/BackButton.jsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <div className="mt-12 text-center">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-1 text-primary font-semibold underline hover:text-highlight transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back 
      </button>
    </div>
  );
}
