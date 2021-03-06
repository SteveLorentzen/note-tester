import * as React from "react";
import {useFirestore, useFirestoreDocData} from "reactfire";
import {ISession} from "./interfacesAndTypes";

export const useSession = (sessionId: string) => {
  const sessionRef = useFirestore().collection("sessions").doc(sessionId);
  const sessionDoc = useFirestoreDocData<ISession>(sessionRef).data;
  return {
    sessionRef,
    sessionDoc,
  };
};

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = React.useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  React.useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export const useToggleBooleanEveryTenSeconds = (
  setStateCallback: React.Dispatch<React.SetStateAction<boolean>>
) => {
  React.useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setStateCallback((prevBool) => !prevBool);
    }, 10000);
    const interval = setInterval(() => {
      setStateCallback((prevBool) => !prevBool);
      setTimeout(() => {
        setStateCallback((prevBool) => !prevBool);
      }, 10000);
    }, 20000);
    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [setStateCallback]);
};
