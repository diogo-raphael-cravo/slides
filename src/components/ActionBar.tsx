import React, { useState, useEffect, useRef } from 'react';

enum Menus {
    NONE = '',
    GEOMETRIES = 'GEOMETRIES',
};

export enum Geometries {
    TRIANGLE = 'TRIANGLE',
    CIRCLE = 'CIRCLE',
    RECTANGLE = 'RECTANGLE',
};

const ActionBar: React.FC<{
    onPlaceGeometry: (geo: Geometries) => void,
    onPickImage: (image: File) => void,
}> = function ({ onPlaceGeometry, onPickImage }) {
    const [menuOpen, setMenuOpen] = useState<string>(Menus.NONE);
    const clickedMenuFlag = useRef<boolean>();
    const imageRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        document.addEventListener('click', () => {
            if (!clickedMenuFlag.current) {
                setMenuOpen(Menus.NONE);
            }
            clickedMenuFlag.current = false;
        });
    }, []);

    function clickMenu(which: string): void {
        clickedMenuFlag.current = true;
        setMenuOpen(which);
    }
    return (
        <div style={{
            backgroundColor: '#d1d1d1',
            marginTop: 5,
            paddingTop: 5,
            paddingLeft: 5,
            position: 'relative'
        }}>
            {/* geometries */}
            <svg onClick={() => clickMenu(Menus.GEOMETRIES)} className='menu-item' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z"/>
            </svg>
            <div style={{
                position: 'absolute',
                backgroundColor: '#fff',
                width: 200,
                height: 100,
                border: '1px solid #d1d1d1',
                boxShadow: '0px 0px 10px 5px #d1d1d1',
                display: menuOpen === Menus.GEOMETRIES ? 'block' : 'none',
            }}>
                {/* @ts-ignore circle */}
                <svg className='menu-item' onClick={() => onPlaceGeometry(Geometries.CIRCLE)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                {/* @ts-ignore square */}
                <svg className='menu-item' onClick={() => onPlaceGeometry(Geometries.RECTANGLE)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-720h720v720H120Zm80-80h560v-560H200v560Zm0 0v-560 560Z"/></svg>
                {/* @ts-ignore triangle */}
                <svg className='menu-item' onClick={() => onPlaceGeometry(Geometries.TRIANGLE)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m80-160 400-640 400 640H80Zm144-80h512L480-650 224-240Zm256-205Z"/></svg>
            </div>
            {/* image */}
            <input ref={imageRef} accept='image/*' type='file' style={{ display: 'none' }}
                onChange={(e: any) => e.target.files[0] && onPickImage(e.target.files[0])}/>
            <svg onClick={() => imageRef.current?.click()} className='menu-item' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/>
            </svg>
        </div>
    );
}

export default ActionBar;
