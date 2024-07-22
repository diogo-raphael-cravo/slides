import { useState } from 'react';

const SlideList = function () {
    const [name, setName] = useState<string>('Unknown presentation');
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <ul style={{ listStyle: 'none', marginTop: 50 }}>
              <li className='slide-list-item'></li>
              <li className='slide-list-item'></li>
              <li className='slide-list-item'></li>
            </ul>
        </div>
    );
}

export default SlideList;
