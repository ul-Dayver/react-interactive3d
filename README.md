# react-interactive3d
Create an interactive 3D object with React

## Installation
Install it from npm and include it in your React build process.

```bash
npm install --save react-interactive3d
```

## Usage

```jsx static
import React from 'react'
import Interactive3D from 'react-interactive3d'

function MyInteractive() {
  const [progress, setProgress] = React.useState(null)
  const src = ["http://localhost:3000/frame_1.jpg", "http://localhost:3000/frame_2.jpg", "http://localhost:3000/frame_3.jpg"]
  
  const onLoad = () => {
    console.log("all images loaded")
    setProgress(null)
  }
  const onError = (error) => {
    console.log(
        error.abort,  //Aborted loading image (true or false)
        error.message,//Message Error
        error.url     //Url image on error
    )
  }

  return (
    <div style={{width: "300px"}}>
      <Interactive3D
        src={src}               //image url list.
        className={"className"} //Classname of canvas element.
        speed={40}              //The speed of the rotation in milliseconds delay; Default = 0.
        rotate={true}           //Auto rotate on\off. Default = false
        directionRotate={-1}    //Auto rotate direction (to left = -1 or to right = 1).
        onProgress={setProgress}//The callback on loading progress. The first argument is a percentage from 0 to 100; The second is the index of the loaded image.
        onLoad={onLoad}         //The callback when done loading images.
        onError={onError}       //The callback on error load image.
        speedTochRotate={3}      //The parameter specifies the number of frames when rotating with the mouse or touch; Default = 1
      />
    </div>
  )
}
```
