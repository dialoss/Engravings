//@ts-nocheck
import {Center, OrbitControls, PresentationControls, Stage} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, {Suspense, useEffect, useLayoutEffect, useState} from 'react';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {fetchRequest} from "api/requests";
import {Mesh, MeshStandardMaterial} from "three";

const MyCanvas = ({data}) => {
    function enableSelect() {
        document.body.style.userSelect = 'auto';
    }
    function disableSelect() {
        document.body.style.userSelect = 'none';
    }
    return (
        <div style={{width:"100%", height: '100%'}}>
            <Canvas onMouseDown={disableSelect} onMouseUp={enableSelect} resize={{ scroll: false }}
                    camera={{fov: 45}}>
                <color attach={"background"} args={["rgb(255,255,255)"]}></color>
                <Suspense fallback={null}>
                    <Stage preset={"soft"} environment={"sunset"} center={[-5,0,-10]}>
                        <Model url={data.url} />
                    </Stage>
                </Suspense>
                <OrbitControls autoRotate={data.rotation} zoomSpeed={5} onWheel={(e)=>false}/>
            </Canvas>
        </div>
    );
};

export default MyCanvas;

const Model = ({url}) => {
    const [model, setModel] = useState(null);
    useLayoutEffect(() => {
        fetchRequest(url).then(res => res.arrayBuffer()).then(file => {
            const loader = new GLTFLoader();
            loader.parse(file, '', model => {
                model.scene.traverse((obj) => {
                        if(obj instanceof Mesh){
                            obj.material = new MeshStandardMaterial({
                                color: obj.material.color,
                                roughness: "0.1",
                                metalness: "0.8",
                            });
                        }
                    }
                )
                setModel(model);
            });
        });
    }, [])

    return (
        <>
            {!!model &&
                <Center>
                    <primitive object={model.scene}
                               scale={10}
                               dispose={null}
                               position={[0, 0, 0]}>
                    </primitive>
                </Center>

            }
        </>
    );
};