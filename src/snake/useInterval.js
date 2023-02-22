import { useEffect, useRef } from "react"

export function useInterval(callback, delay, start, pause) {
  const savedCallback = useRef()
  // console.log(delay, "edlayh")
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    // console.log("odplaa sie")
    if (delay !== null && start && !pause) {
      let id = setInterval(tick, delay)

      return () => clearInterval(id)
    }
  }, [delay, start, pause])
}
