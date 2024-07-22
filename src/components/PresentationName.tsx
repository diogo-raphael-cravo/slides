import { useState } from 'react';

function PresentationName() {
    const [name, setName] = useState<string>('Unknown presentation');
    return (
        <div>
            <input type='text' style={{
                fontSize: 20,
                border: '0px',
                backgroundColor: '#f2f3f4',
            }} value={name} onChange={(e) => setName(e.target.value)}></input>
        </div>
    );
}

export default PresentationName;
