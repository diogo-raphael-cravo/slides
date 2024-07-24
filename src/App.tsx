import './App.css';
import { useState } from 'react';
import PresentationName from './components/PresentationName';
import ActionBar, { Geometries } from './components/ActionBar';
import SlideList from './components/SlideList';
import Slide from './components/Slide';
function App() {
  const [slideGeometries, setSlideGeometries] = useState<{ id: string, geo: Geometries }[]>([]);
  const [slideImages, setSlideImages] = useState<{ id: string, image: string | ArrayBuffer | null | undefined }[]>([]);

  function onPlaceGeometry(geo: Geometries) {
    setSlideGeometries(geometries => [...geometries, {
      id: `${Math.random()}`,
      geo,
    }]);
  }
  function onPickImage(image: File) {
    const reader = new FileReader();

    reader.onload = function(e) {
      setSlideImages(prev => [
        ...prev, {
        id: `${Math.random()}`,
        image: e?.target?.result,
      }])
    };

    reader.readAsDataURL(image);
  }
  return (
    <div className="app">
      <PresentationName/>
      <div>Menus</div>
      <ActionBar onPlaceGeometry={onPlaceGeometry} onPickImage={onPickImage}/>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
      }}>
        <SlideList/>
        <Slide geometries={slideGeometries} images={slideImages}/>
        </div>
      <div style={{ height: 100 }}></div>
    </div>
  );
}

export default App;
