import { useState } from "react";
import uploadHints from "../../Services/uploadHints";

export function Upload() {
  const [csvUri, setUri] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  return (
    <>
      <div>
        <header>
          <h1>Upload</h1>
        </header>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setMessage("Loading...");
            setMessage(await uploadHints(csvUri));
          }}
        >
          <input
            type="text"
            placeholder="S3 file name"
            value={csvUri}
            onChange={(e) => setUri(e.target.value)}
          />
          <button type="submit" className="primary">
            Submit
          </button>
          <span>{message}</span>
        </form>
      </div>
    </>
  );
}
