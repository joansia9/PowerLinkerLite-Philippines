/**
 * Creates a link button that opens a URL in a new window/tab.
 * @param {string} url the url of the page you want to open in a new window
 * @param {string} linkName the link message that shows up on the button
 * @param {string} className optional CSS class name for the button
 * @returns {Component} the link button
 */
export default function NewWindowLink({
  url,
  linkName,
  className,
}: {
  url: string;
  linkName: string;
  className?: string;
}) {

  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button onClick={handleClick} type="button" className={className ?? "outlined"}>
      {linkName}
    </button>
  );
};
