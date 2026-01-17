export default function SubmitSpinner({ loadingMsg = "Loading..." }) {
  return (
    <div className="submit-spinner flex items-center justify-center gap-1">
      <div className="spinner-border inline-block h-4 w-4 animate-spin rounded-full border-3 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <span className="visually-hidden">{loadingMsg}</span>
    </div>
  );
}
