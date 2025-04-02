import { useEffect, useRef } from "react";

function useOutsideClick(
  actionFunction: React.Dispatch<React.SetStateAction<boolean>>,
  optionalFunction?: React.Dispatch<React.SetStateAction<boolean>>,
  listenInCapturingPhase = true,
) {
  // ! adjust type for ref as needed
  const menuRef = useRef<HTMLUListElement | null>(null);
  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        if (
          menuRef.current &&
          e.target instanceof Node &&
          !menuRef.current.contains(e.target)
        ) {
          actionFunction(false);
          if (optionalFunction) optionalFunction(false);
        }
      }
      //  adding 'true' as the 3rd argument to addEvListener - // ! this will make it listen in CAPTURING PHASE instead of bubbling phase
      document.addEventListener("click", handleClick, listenInCapturingPhase);

      return () =>
        document.removeEventListener(
          "click",
          handleClick,
          listenInCapturingPhase,
        );
    },
    [actionFunction, listenInCapturingPhase, optionalFunction],
  );

  return menuRef;
}

export default useOutsideClick;
