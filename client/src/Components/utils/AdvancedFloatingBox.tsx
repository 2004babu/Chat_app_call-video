import React from "react";
import { Rnd } from "react-rnd";

interface AdvancedFloatingBoxTYPE {
    children: React.ReactNode;
}

export default function AdvancedFloatingBox({ children }: AdvancedFloatingBoxTYPE) {
    // const [size, setSize] = useState({ width: 320, height: 180 });
    // const [position, setPosition] = useState({ x: 100, y: 100 });

    return (
        <Rnd
            position={{ x:100,y:100 }}
            // onDrag={(e, d) => setPosition({ x: d.x, y: d.y })}
            // onResizeStop={(e, direction, ref, delta, position) => {
            //     // setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
            //     setPosition(position);
            // }}
            minWidth={200}
            minHeight={100}
            className="bg-white rounded-lg p-2 "
            bounds="window"
            allowAnyClick={true}

        >
            <div className="flex flex-col justify-center items-center gap-2 w-full h-full ">

                {children}
            </div>
        </Rnd>
    );
}
