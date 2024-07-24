

const SlideList: React.FC<{
  images: { id: string, src: string | undefined }[],
}> = function ({ images }) {
    
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <ul style={{ listStyle: 'none', marginTop: 50 }}>
              { images.map(({ id, src }) => (
                <li className='slide-list-item' key={id}>
                  { !src && <></> }
                  { src && <img className='slide-list-item' src={src}/> }
                </li>
              )) }
            </ul>
        </div>
    );
}

export default SlideList;
