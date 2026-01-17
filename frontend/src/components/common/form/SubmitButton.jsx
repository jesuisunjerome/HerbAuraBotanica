import SubmitSpinner from "./SubmitSpinner";

export default function SubmitButton({ text, isLoading, disabled }) {
  return (
    <button type="submit" className="submit-button" disabled={disabled}>
      {isLoading ? <SubmitSpinner /> : text}
    </button>
  );
}
