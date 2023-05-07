import { useState } from "react";
import storage from "./firebaseConfig.js";
import { ref } from "firebase/storage";
import {
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

function App() {
  const [percent, setPercent] = useState(0);
  const [file, setFile] = useState("");

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  function handleUpload() {
    if (!file) {
      alert("Please choose a file first!")
    }
    const storageRef = ref(storage, `/files/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
        });
      }
    ); 
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col space-y-4">
        <label className="block text-gray-700 font-bold">Choose a file:</label>
        <input type="file" onChange={handleChange} accept="" className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm"/>
        <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm">Upload to Firebase</button>
        <p className="text-center">{percent}% done</p>
      </div>
    </div>
  )
}

export default App;
