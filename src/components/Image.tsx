import React, { useState, useRef, useEffect } from 'react';
import { Geometries } from './ActionBar';

enum ResizeDirection {
    TOP_RIGHT = 'TOP_RIGHT',
    TOP_LEFT = 'TOP_LEFT',
    TOP = 'TOP',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    BOTTOM = 'BOTTOM',
    BOTTOM_RIGHT = 'BOTTOM_RIGHT',
    BOTTOM_LEFT = 'BOTTOM_LEFT',
    NONE = 'NONE',
}

const Image: React.FC<{
    id: string,
    src: string | ArrayBuffer | null | undefined,
    position: { top: number, left: number },
    onChangePosition: (offset: { top: number, left: number }) => void,
    onDragStart: (offset: { top: number, left: number }) => void,
}> = function ({ id, src, position, onChangePosition, onDragStart }) {
    const [dimensions, setDimensions] = useState<{ w: number, h: number }>({ w: 50, h: 50 });
    const [showResizeBox, setShowResizeBox] = useState<boolean>(false);
    const clickedGeometryFlag = useRef<boolean>();
    const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(ResizeDirection.NONE);
    const parent = useRef<HTMLDivElement>(null);
    const [shadowDimensions, setShadowDimensions] = useState<{ w: number, h: number }>({ w: dimensions.w, h: dimensions.h });
    const [shadowPosition, setShadowPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });

    useEffect(() => {
        const handleGlobalClick = () => {
            if (!clickedGeometryFlag.current) {
                setShowResizeBox(false);
            }
            clickedGeometryFlag.current = false;
        };
        document.addEventListener('click', handleGlobalClick);

        const handleMouseMove = (e: any) => {
            if (resizeDirection !== ResizeDirection.NONE) {
                const rect = parent?.current?.getBoundingClientRect();
                if (!rect) {
                    return;
                }
                
                let top = shadowPosition.top;
                let left = shadowPosition.left;
                let w = shadowDimensions.w;
                let h = shadowDimensions.h;
                if (resizeDirection === ResizeDirection.TOP_RIGHT) {
                    top = - (rect.top - e.clientY);
                    left = 0;
                    w = e.clientX - rect.left;
                    h = rect.top - e.clientY + dimensions.h;
                } else if (resizeDirection === ResizeDirection.TOP_LEFT) {
                    top = - (rect.top - e.clientY);
                    left = - (rect.left - e.clientX);
                    w = rect.left - e.clientX + dimensions.w;
                    h = rect.top - e.clientY + dimensions.h;
                } else if (resizeDirection === ResizeDirection.TOP) {
                    top = - (rect.top - e.clientY);
                    left = 0;
                    w = shadowDimensions.w;
                    h = rect.top - e.clientY + dimensions.h;
                } else if (resizeDirection === ResizeDirection.LEFT) {
                    top = 0;
                    left = - (rect.left - e.clientX);
                    w = rect.left - e.clientX + dimensions.w;
                    h = shadowDimensions.h;
                } else if (resizeDirection === ResizeDirection.RIGHT) {
                    w = e.clientX - rect.left;
                    h = shadowDimensions.h;
                } else if (resizeDirection === ResizeDirection.BOTTOM) {
                    w = shadowDimensions.w;
                    h = e.clientY - rect.top;
                } else if (resizeDirection === ResizeDirection.BOTTOM_RIGHT) {
                    w = e.clientX - rect.left;
                    h = e.clientY - rect.top;
                } else if (resizeDirection === ResizeDirection.BOTTOM_LEFT) {
                    top = 0;
                    left = - (rect.left - e.clientX);
                    w = rect.left - e.clientX + dimensions.w;
                    h = e.clientY - rect.top;
                }

                if (w < 0 || h < 0) {
                    return;
                }
                setShadowPosition({
                    top,
                    left,
                });
                setShadowDimensions({
                    w,
                    h,
                });
            }
        }
        document.addEventListener('mousemove', handleMouseMove);

        const handleMouseUp = () => {
            if (resizeDirection !== ResizeDirection.NONE) {
                setResizeDirection(ResizeDirection.NONE);
                setDimensions({ ...shadowDimensions });
                onChangePosition({ ...shadowPosition });
            }
        }
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('click', handleGlobalClick);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    }, [resizeDirection, shadowDimensions]);


    function click() {
        clickedGeometryFlag.current = true;
        setShowResizeBox(true);
    }
    const svgStyle = {
        width: '100%',
        height: '100%',
        display: resizeDirection === ResizeDirection.NONE ? 'flex' : 'none'
    };

    function getGeometry(style: Record<string, string | number>) {
        if (typeof src !== 'string') {
            return <></>;
        }
        return <img src={src} style={style}></img>;
    }

    let style: Record<string, string> = {
        cursor: 'move',
        width: `${dimensions.w}px`,
        height: `${dimensions.h}px`,
        position: 'absolute',
        overflow: 'visible',
        top: `${position.top}px`,
        left: `${position.left}px`,
        border: '2px solid #fff',
    };
    if (showResizeBox) {
        style.border = '2px solid lightgreen';
    }
    
    function dragStart(e: any) {
        if (resizeDirection !== ResizeDirection.NONE) {
            e.preventDefault();
            return;
        }
        const rect = parent?.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }
        const offset = {
            left: e.clientX - rect.left,
            top: e.clientY - rect.top,
        };
        onDragStart(offset);
        setShowResizeBox(false);
        e.dataTransfer.setData('text/plain', id);
    }
    function dragEnd() {
        setShowResizeBox(true);
    }
    function startResize(direction: ResizeDirection) {
        setShadowDimensions({ w: dimensions.w, h: dimensions.h });
        setShadowPosition({
            top: 0,
            left: 0,
        });
        setResizeDirection(direction);
    }
    const resizeSquareStyle: Record<string, string | number> = {
        display: showResizeBox ? 'block' : 'none',
        position: 'absolute',
        width: 6,
        height: 6,
        backgroundColor: 'lightgreen',
    };
    const shadowStyle = {
        width: `${shadowDimensions.w}px`,
        height: `${shadowDimensions.h}px`,
        top: `${shadowPosition.top}px`,
        left: `${shadowPosition.left}px`,
        opacity: 0.5,
        position: 'absolute',
        backgroundColor: 'red',
        display: resizeDirection !== ResizeDirection.NONE ? 'flex' : 'none'
    };
    return <div ref={parent} onClick={click} style={style} draggable onDragStart={dragStart} onDragEnd={dragEnd}>
        <div onMouseDown={() => startResize(ResizeDirection.TOP_LEFT)} className='resize-diagonal-top-right' style={{
            ...resizeSquareStyle,
            top: '-4px',
            left: '-4px',
        }}></div>
        <div onMouseDown={() => startResize(ResizeDirection.TOP)} className='resize-vertical' style={{
            ...resizeSquareStyle,
            top: '-4px',
            left: `${(dimensions.w / 2) - 3}px`,
        }}></div>
        <div onMouseDown={() => startResize(ResizeDirection.TOP_RIGHT)} className='resize-diagonal-top-left' style={{
            ...resizeSquareStyle,
            top: '-4px',
            left: `${dimensions.w - 2}px`,
        }}></div>

        <div onMouseDown={() => startResize(ResizeDirection.LEFT)} className='resize-horizontal' style={{
            ...resizeSquareStyle,
            top: `${(dimensions.h / 2) - 3}px`,
            left: '-4px',
        }}></div>
        <div onMouseDown={() => startResize(ResizeDirection.RIGHT)} className='resize-horizontal' style={{
            ...resizeSquareStyle,
            top: `${(dimensions.h / 2) - 3}px`,
            left: `${dimensions.w - 2}px`,
        }}></div>

        <div onMouseDown={() => startResize(ResizeDirection.BOTTOM_LEFT)} className='resize-diagonal-top-left' style={{
            ...resizeSquareStyle,
            bottom: '-4px',
            left: '-4px',
        }}></div>
        <div onMouseDown={() => startResize(ResizeDirection.BOTTOM)} className='resize-vertical' style={{
            ...resizeSquareStyle,
            bottom: '-4px',
            left: `${(dimensions.w / 2) - 3}px`,
        }}></div>
        <div onMouseDown={() => startResize(ResizeDirection.BOTTOM_RIGHT)} className='resize-diagonal-top-right' style={{
            ...resizeSquareStyle,
            bottom: '-4px',
            left: `${dimensions.w - 2}px`,
        }}></div>
        {getGeometry(svgStyle)}
        {getGeometry(shadowStyle)}
    </div>
}

export default Image;
