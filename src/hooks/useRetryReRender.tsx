// import { useEffect, useState } from "react";
// import { useStateStore } from "../state/store";

// export const useRetryReRender = () => {
//   const { playerState } = useStateStore((state) => state);
//   const [retryTick, setRetryTick] = useState(0);

//   useEffect(() => {
//     console.log();
//     if (!playerState) {
//       const timer = setTimeout(() => {
//         setRetryTick((prev) => prev + 1); // trigger re-render
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [playerState, retryTick]);

//   return retryTick; // <- RETURN something changing
// };
