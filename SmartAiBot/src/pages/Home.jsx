import React, { useContext, useState } from 'react';
import "../App.css";
import { RiImageAiLine, RiImageAddLine, RiChatSmileAiLine } from "react-icons/ri";
import { IoAddOutline } from "react-icons/io5";
import { FaArrowUpLong } from "react-icons/fa6";
import { DataContext, prevUser, user } from '../context/UserContext';
import { generateResponse } from '../gemini';
import { query } from '../HuggingFace';

function Home() {
  let { startRes, setStartRes, popup, setPopUp, input, setInput, feature, setFeature, prevInput, setPrevInput } = useContext(DataContext);

  const [imageUrl, setImageUrl] = useState("");
  const [response, setResponse] = useState("");
  const [showGeneratedImage, setShowGeneratedImage] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    setStartRes(true);

    // Ensure the image remains visible if previously uploaded
    if (!imageUrl) {
      setShowGeneratedImage(false);
    }

    prevUser.data = user.data;
    prevUser.mime_type = user.mime_type;
    prevUser.imgUrl = user.imgUrl;
    setPrevInput(input);
    prevUser.prompt = input;
    setInput("");

    try {
      let result = await generateResponse();
      if (!result || typeof result !== "string") {
        console.error("Invalid response from API:", result);
        setResponse("An error occurred. Please try again.");
        return;
      }
      setResponse(result);
    } catch (error) {
      console.error("Error in generateResponse():", error);
      setResponse("Failed to generate response.");
    }
  }


  function handleImg(e) {
    let file = e.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = (event) => {
      let base64 = event.target.result.split(",")[1];
      user.data = base64;
      user.mime_type = file.type;
      let imgSrc = `data:${user.mime_type};base64,${user.data}`;

      setImageUrl(imgSrc);
      setFeature("upImage");
      setShowGeneratedImage(true);

      // 🚀 Immediately switch to the chat page
      setPrevInput("Uploaded an image");
      setStartRes(true);
      setResponse("Processing the uploaded image...");
    };
    reader.readAsDataURL(file);
  }

  async function handleGenerateImg() {
    if (!input.trim()) return;  // Ensure there's input

    try {
      setStartRes(true);
      setShowGeneratedImage(true);
      setResponse("Generating image...");

      let result = await query(input);  // Pass input as prompt

      if (result) {
        let imgUrl = URL.createObjectURL(result);  // Convert blob to URL
        setImageUrl(imgUrl);
        setPrevInput(input);
        setResponse("Here is your generated image!");
      } else {
        setResponse("Failed to generate image. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleGenerateImg:", error);
      setResponse("An error occurred while generating the image.");
    }
  }


  return (
    <div className='home'>
      <nav>
        <div className='logo' onClick={() => {
          setStartRes(false);
          setFeature("chat");
          setShowGeneratedImage(false); // Hide image when switching to chat
        }}>SmartAIBot</div>
        <img src="Mainlogo.png" alt="Mainlogo" />
      </nav>

      <input type="file" accept="image/*" hidden id="inputImg" onChange={handleImg} />

      {startRes ? (
        <div className="chat-box">
          {showGeneratedImage && imageUrl && <img src={imageUrl} alt="Generated" className='uploaded-image' />}
          <div className="message user-message">{prevInput}</div>
          <div className="message bot-message">{response || "Generating response..."}</div>
        </div>
      ) : (
        <div className='hero'>
          <span id='tag'>Tell me what you need help with!</span>
          <div className='category'>
            <div className='upImage' onClick={() => document.getElementById("inputImg").click()}>
              <RiImageAddLine className="icon" />
              <span>Upload Image</span>
            </div>
            <div className='genImage' onClick={() => setFeature("genImage")}>
              <RiImageAiLine className="icon" />
              <span>Generate Image</span>
            </div>
            <div className='chat' onClick={() => {
              setFeature("chat");
              setShowGeneratedImage(false); // Hide image when switching to chat
            }}>
              <RiChatSmileAiLine className="icon" />
              <span>Chat</span>
            </div>
          </div>
        </div>
      )}

      <form className='input-box' onSubmit={(e) => {
        e.preventDefault();
        if (feature === "genImage") {
          handleGenerateImg();
        } else {
          handleSubmit(e);
        }
      }}>

        {popup && (
          <div className="pop-up">
            <div className="select-up" onClick={() => {
              setPopUp(false)
              document.getElementById("inputImg").click()
            }}>
              <RiImageAddLine />
              <span>Upload Image</span>
            </div>
            <div className="select-gen" onClick={() => {
              setPopUp(false)
              setFeature("genImage")
            }}>
              <RiImageAiLine />
              <span>Generate Image</span>
            </div>
          </div>
        )}

        <div id='add' onClick={() => setPopUp(prev => !prev)}>
          {feature === "genImage" ? <RiImageAiLine id='img' /> : <IoAddOutline />}
        </div>
        <input type="text" placeholder='I’m listening… go ahead' onChange={(e) => setInput(e.target.value)} value={input} />
        <button id='submit'>
          <FaArrowUpLong />
        </button>
      </form>
    </div>
  );
}

export default Home;
