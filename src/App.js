import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    // If you prefer to use the Iframe implementation, you can replace this line with: WebViewer.Iframe(...)
    WebViewer.WebComponent(
      {
        path: '/webviewer/lib',
        enableOfficeEditing: true,
        initialDoc: '/files/test.docx'
      },
      viewer.current,
    ).then((instance) => {
      const { documentViewer, annotationManager  } = instance.Core;

      instance.UI.setHeaderItems(header => {
        header.push({
            type: 'actionButton',
            img: '/logo512.png',
            onClick: async () => {
              const doc = documentViewer.getDocument();
              const xfdfString = await annotationManager.exportAnnotations();
              const data = await doc.getFileData({
                // saves the document with annotations in it
                xfdfString
              });
              const arr = new Uint8Array(data);
              const blob = new Blob([arr], { type: 'application/docx' });
              window.saveAs(blob, 'downloaded.docx');
              // Add code for handling Blob here
            }
        });
      });
    });
  }, []);

  return (
    <div className="App">
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
