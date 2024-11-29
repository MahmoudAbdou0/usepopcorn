import { useState, useEffect } from "react";
const KEY = "419ddf4c";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    callback?.();

    const controller = new AbortController();
    async function fetchMovie() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query} `,
          { signal: controller.signal }
        );
        // console.log(res);
        if (!res.ok)
          throw new Error("Something went wrong withfetching movies");
        const data = await res.json();
        // console.log(data);
        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovie();

    return () => {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
}
