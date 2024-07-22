import React, { useState, useEffect, useRef } from 'react';
import { Geometries } from './ActionBar';
import Geometry from './Geometry';

const Slide: React.FC<{
    geometries: { id: string, geo: Geometries }[],
}> = function ({ geometries }) {
    const [positions, setPositions] = useState<{ id: string, top: number, left: number }[]>([]);
    const parent = useRef<HTMLDivElement>(null);
    const dragOffset = useRef<{ top: number, left: number }>({ top: 0, left: 0 });

    function updatePosition(id: string, top: number, left: number): void {
        setPositions(prevPositions => {
            const newPos = prevPositions.filter(prev => prev.id !== id);
            return [
                ...newPos,
                {
                    id,
                    top,
                    left,
                },
            ];
        });
    }

    const handleDragOver = (e: any) => {
        e.preventDefault();
    };
    const handleDrop = (e: any) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const rect = parent?.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }
        const dropX = e.clientX - rect.left - dragOffset.current.left;
        const dropY = e.clientY - rect.top - dragOffset.current.top;
        updatePosition(id, dropY, dropX);
    };
    useEffect(() => {
        setPositions(prevPositions => {
            const missing = geometries.filter(({ id }) => !prevPositions.find(prev => prev.id === id));
            return [
                ...prevPositions,
                ...missing.map(m => ({
                    id: m.id,
                    top: 50,
                    left: 50,
                })),
            ];
        });
    }, [geometries]);
    function getPosition(id: string): { top: number, left: number } {
        return positions.find(pos => pos.id === id) || { top: 50, left: 50 };
    }
    return (
        <div ref={parent}style={{
            backgroundColor: '#fff',
            flex: '0 0 1200px',
            border: '1px solid #d1d1d1',
            margin: '50px',
            display: 'flex',
        }} onDragOver={handleDragOver} onDrop={handleDrop}>
            { geometries.map(({ id, geo }) => <Geometry key={id} id={id} geo={geo} position={getPosition(id)}
                onChangePosition={({ top, left }) => {
                    const curr = getPosition(id);
                    updatePosition(id, curr.top + top, curr.left + left);
                }}
                onDragStart={offset => { dragOffset.current = offset }}/>) }
        </div>
    );
}

export default Slide;
