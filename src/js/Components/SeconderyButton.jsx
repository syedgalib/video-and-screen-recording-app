function SeconderyButton({ label, onClick, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="start-recording mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-blue-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50 rounded-md"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default SeconderyButton;
