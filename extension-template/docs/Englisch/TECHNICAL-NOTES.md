# Features and technical notes

The template includes a multilingual dashboard, app search, quick settings and a Browser Store.

## Account and cloud
The sample account uses GitHub Device Flow. After configuring your own GitHub App, it can back up settings to a private repository.

## Photo and video cloud
The media app includes a gallery, file search, camera and video recording. It is designed for your own private GitHub media repository. Camera access requires browser permission.

## Camera
The camera app can use the front or rear camera, depending on the browser and device. Camera and microphone access must be explicitly granted.

## Demo
`standalone/browser-os-standalone.html` is a standalone web demo. It is not the installable extension. Test demo functions separately; browser APIs and GitHub sign-in can behave differently on a normal website than inside an extension.