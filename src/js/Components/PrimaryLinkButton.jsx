function PrimaryLinkButton({ label, href, download }) {
  return (
    <a
      href={href}
      download={download}
      className="start-recording text-center mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-pink-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50 rounded-md"
    >
      {label}
    </a>
  );
}

export default PrimaryLinkButton;
