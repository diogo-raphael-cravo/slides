import React, { useState, useEffect, useRef } from 'react';
import { Geometries } from './ActionBar';
import Geometry from './Geometry';
import Image from './Image';

const Slide: React.FC<{
    geometries: { id: string, geo: Geometries }[],
    images: { id: string, image: string | ArrayBuffer | null | undefined }[],
    onSlideChanged: () => void,
}> = function ({ geometries, images, onSlideChanged }) {
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
        console.log(`${e.clientX} - ${rect.left} - ${dragOffset.current.left} = ${e.clientX - rect.left - dragOffset.current.left}`)
        console.log(`${e.clientY} - ${rect.top} - ${dragOffset.current.top} = ${e.clientY - rect.top - dragOffset.current.top}`)
        const dropX = e.clientX - dragOffset.current.left;
        const dropY = e.clientY - dragOffset.current.top;
        updatePosition(id, dropY, dropX);
        onSlideChanged();
    };
    useEffect(() => {
        setPositions(prevPositions => {
            const missingGeometries = geometries.filter(({ id }) => !prevPositions.find(prev => prev.id === id));
            const missingImages = images.filter(({ id }) => !prevPositions.find(prev => prev.id === id));
            return [
                ...prevPositions,
                ...missingGeometries.map(m => ({
                    id: m.id,
                    top: 200,
                    left: 300,
                })),
                ...missingImages.map(m => ({
                    id: m.id,
                    top: 200,
                    left: 300,
                })),
            ];
        });
    }, [geometries, images]);
    function getPosition(id: string): { top: number, left: number } {
        return positions.find(pos => pos.id === id) || { top: 50, left: 50 };
    }
    return (
        <div ref={parent} style={{
            flex: '1',
            display: 'flex',
        }} onDragOver={handleDragOver} onDrop={handleDrop}>
            { geometries.map(({ id, geo }) => <Geometry
                key={id} id={id} geo={geo} position={getPosition(id)}
                onChangePosition={({ top, left }) => {
                    const curr = getPosition(id);
                    updatePosition(id, curr.top + top, curr.left + left);
                }}
                onDragStart={offset => { dragOffset.current = offset }}
                onGeometryChanged={onSlideChanged}
                />) }
            { images.map(({ id, image }) => <Image
                key={id} id={id} src={image} position={getPosition(id)}
                onChangePosition={({ top, left }) => {
                    const curr = getPosition(id);
                    updatePosition(id, curr.top + top, curr.left + left);
                }}
                onDragStart={offset => { dragOffset.current = offset }}
                onImageChanged={onSlideChanged}
                />) }
        </div>
    );
}

export default Slide;
