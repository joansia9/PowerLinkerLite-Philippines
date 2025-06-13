import { useEffect } from "react";
import { useLambdaFetch } from "../Hooks/useLambdaFetch";
import NumidentHint from "../Models/NumidentHint";

export default function useGetHint({
  hintsRequested,
  data,
  setData,
  setHintsInFlight,
  maxHints,
}: {
  hintsRequested: number;
  data: (NumidentHint | Error)[];
  setData: Function;
  setHintsInFlight: Function;
  maxHints: number;
}) {
  useEffect(
    () => setHintsInFlight((prev: number) => prev + 1),
    [hintsRequested, setHintsInFlight]
  );
  const hintState = useLambdaFetch<NumidentHint>(
    "/hint?num-requested=" + hintsRequested,
    {
      method: "GET",
    }
  );

  if (
    hintState.error &&
    data.length < maxHints &&
    !(JSON.stringify(data[data.length - 1]) === JSON.stringify(hintState.error))
  ) {
    const newData = [...data];
    newData.push(hintState.error);
    setHintsInFlight((prev: number) => prev - 1);
    setData(newData);
  }

  if (
    hintState.data &&
    data.length < maxHints &&
    !(JSON.stringify(data[data.length - 1]) === JSON.stringify(hintState.data))
  ) {
    const newData = [...data];
    newData.push(hintState.data);
    setHintsInFlight((prev: number) => prev - 1);
    setData(newData);
  }
}
