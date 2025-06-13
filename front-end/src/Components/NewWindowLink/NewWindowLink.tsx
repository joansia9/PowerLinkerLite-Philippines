/**
 * Calculates the appropriate highlight color given output from nameComparator or dateComparator.
 * @param {string} url the url of the page you want to open in a new window
 * @param {string} linkName the link message that shows up on the button
 * @returns {Component} the link button
 */
export default function NewWindowLink({
  url,
  linkName,
}: {
  url: string;
  linkName: string;
}) {

  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button onClick={handleClick} type="button" className="outlined">
      {linkName}
    </button>
  );
};
