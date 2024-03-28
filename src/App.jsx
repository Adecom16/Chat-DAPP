import { useState } from "react";
import Header from "./components/header";
import { configureWeb3Modal } from "./connection";
import ChatComponent from "./components/chat";
// import RegisterENS from "./components/Register,jsx";
configureWeb3Modal();
function App() {
  const [selectedFile, setSelectedFile] = useState();
  const [image, setImage] = useState("");

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);
      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      setImage(
        `https://maroon-recent-marmoset-248.mypinata.cloud/ipfs/${resData.IpfsHash}`
      );
      console.log(resData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <Header />
      </div>
      <ChatComponent />
      {/* <RegisterENS/> */}
      {/* <div>
        <img
          className="w-10 h-10 rounded-full"
          src={image}
          alt="Rounded avatar"
        />
      </div>
      <label className="form-label">Choose File</label>
      <input type="file" onChange={changeHandler} />
      <button onClick={handleSubmission}>Submit</button> */}
    </>
  );
}

export default App;
