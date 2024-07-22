import './App.css';
import { useState } from 'react';
import PresentationName from './components/PresentationName';
import ActionBar, { Geometries } from './components/ActionBar';
import SlideList from './components/SlideList';
import Slide from './components/Slide';
function App() {
  const [slideGeometries, setSlideGeometries] = useState<{ id: string, geo: Geometries }[]>([]);

  function onPlaceGeometry(geo: Geometries) {
    setSlideGeometries(geometries => [...geometries, {
      id: `${Math.random()}`,
      geo,
    }]);
  }
  return (
    <div className="app">
      <PresentationName/>
      <div>Menus</div>
      <ActionBar onPlaceGeometry={onPlaceGeometry}/>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
      }}>
        <SlideList/>
        <Slide geometries={slideGeometries}/>
        </div>
      <div style={{ height: 100 }}></div>
    </div>
  );
}

export default App;
