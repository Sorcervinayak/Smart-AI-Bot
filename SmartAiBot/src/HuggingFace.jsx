export async function query(prompt) {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_HUGGING_FACE_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),  // Pass the prompt dynamically
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to fetch image from Hugging Face API.");
    }
  
    return response.blob();  // Return the image blob
  }
  