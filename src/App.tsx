import './App.css';
import { useState, useRef, useEffect } from 'react';
import PresentationName from './components/PresentationName';
import ActionBar, { Geometries } from './components/ActionBar';
import SlideList from './components/SlideList';
import Slide from './components/Slide';
import html2canvas from 'html2canvas';
import { TextType } from './components/Text';


function App() {
  const [slideGeometries, setSlideGeometries] = useState<{ id: string, geo: Geometries }[]>([]);
  const [slideImages, setSlideImages] = useState<{ id: string, image: string | ArrayBuffer | null | undefined }[]>([]);
  const [slideText, setSlideText] = useState<{ id: string, text: TextType }[]>([]);
  const [slidePreviews, setSlidePreviews] = useState<{ id: string, src: string | undefined }[]>([{
    id: `${Math.random()}`,
    src: undefined,
  }]);
  const slideRef = useRef<any>(null);
  const [shouldUpdateSlide, setShouldUpdateSlide] = useState<boolean>(false);

  useEffect(() => {
    if (shouldUpdateSlide) {
      updateCurrentSlidePreview();
      setShouldUpdateSlide(false);
    }
  }, [shouldUpdateSlide]);

  function onPlaceText() {
    setSlideText(texts => [...texts, {
      id: `${Math.random()}`,
      text: {
        content: 'Replace this text...'
      },
    }]);
  }
  function onPlaceGeometry(geo: Geometries) {
    setSlideGeometries(geometries => [...geometries, {
      id: `${Math.random()}`,
      geo,
    }]);
    setShouldUpdateSlide(true);
  }
  function onPickImage(image: File) {
    const reader = new FileReader();

    reader.onload = function(e) {
      setSlideImages(prev => [
        ...prev, {
        id: `${Math.random()}`,
        image: e?.target?.result,
      }])
      setShouldUpdateSlide(true);
    };

    reader.readAsDataURL(image);
  }
  async function updateCurrentSlidePreview() {
    try {
      const canvas = await html2canvas(slideRef.current);
      const imgData = canvas.toDataURL('image/png');
      setSlidePreviews([{
        id: slidePreviews[0].id,
        src: imgData,
      }])
    } catch {

    }
  }
  function onTextChanged(newText: { id: string, text: TextType }) {
    setSlideText(texts => {
      const otherTexts = texts.filter(t => t.id !== newText.id);
      return [
        ...otherTexts,
        {
          ...newText,
        },
      ]
    });
    setShouldUpdateSlide(true);
  }
  return (
    <div className="app">
      <PresentationName/>
      <div>Menus</div>
      <ActionBar onPlaceGeometry={onPlaceGeometry} onPickImage={onPickImage} onPlaceText={onPlaceText} />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
      }}>
        <SlideList images={slidePreviews}/>
        <div style={{
            backgroundColor: '#fff',
            flex: '0 0 1200px',
            border: '1px solid #d1d1d1',
            margin: '50px',
            display: 'flex',
        }} ref={slideRef}>
          <Slide geometries={slideGeometries} images={slideImages} text={slideText} onSlideChanged={() => setShouldUpdateSlide(true)} onTextChanged={onTextChanged}/>
        </div>
        </div>
      <div style={{ height: 100 }}></div>
    </div>
  );
}

export default App;
