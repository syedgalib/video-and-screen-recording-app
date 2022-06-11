function DangerButton({ label, onClick, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="start-recording mx-4 p-4 flex-1 bg-gradient-to-br from-red-500 to-red-700 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50 rounded-md"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default DangerButton;
