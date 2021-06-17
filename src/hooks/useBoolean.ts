import { useState } from 'react';

const useBoolean = (val: boolean) => {
  const [ bool, setBool ] = useState(val)

  const toggle = () => setBool(x => !x)

  const on = () => setBool(true)
  const off = () => setBool(false)

  return { toggle, on, off, value: bool }
}

export default useBoolean
