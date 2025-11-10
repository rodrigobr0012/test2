import { useEffect, useState } from "react";

export function useFetch(asyncFn, deps = []) {
  const [data, setData]   = useState(null);
  const [loading, setL]   = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setL(true);
    asyncFn()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e))
      .finally(() => alive && setL(false));
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
