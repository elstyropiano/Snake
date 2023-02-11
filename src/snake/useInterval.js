import { useEffect, useRef } from "react"

export function useInterval(callback, delay, start, pause, firstRender) {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null && start && !pause) {
      let id = setInterval(tick, delay)

      return () => clearInterval(id)
    }
  }, [delay, start, pause])
}
