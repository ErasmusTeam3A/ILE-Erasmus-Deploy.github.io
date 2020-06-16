import React, { useRef, useMemo } from 'react'
import * as OBJLoader from 'three-obj-loader';

const Testie = ({ url }) => {
    const model = useRef()
    let rot = 0

    const obj = useMemo(() => new OBJLoader().load(url), [url])

    return <primitive object={obj} ref={model} />
}

export default Testie;
