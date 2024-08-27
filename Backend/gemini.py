
import google.generativeai as genai

import PIL.Image
from dotenv import load_dotenv
import os

async def image_mood_generator(path):
  load_dotenv()
  secret_value = os.getenv("GOOGLE_API_KEY")
  GOOGLE_API_KEY=secret_value

  genai.configure(api_key=GOOGLE_API_KEY)

  img_path = path[0] 
  img = PIL.Image.open(img_path)

  model = genai.GenerativeModel('gemini-pro-vision')

  response = model.generate_content(["""Please only respond with one exact word that reflects the 
                                     emotional mood conveyed by the provided image given this 
                                     list of words you can choose from. The list of words you can choose 
                                     from is happy, sad, energetic, angry, chill, carefree, 
                                     classical, retro, or euphoric. 
                                     Feel free to interpret the mood in 
                                     any way you see fit, but only choose one word, I want no other words or 
                                     sentences generated. Again, please choose only from the follow words: happy, sad, energetic, angry, chill, carefree, 
                                     classical, retro, or euphoric.""", img], stream=True)
  
  response.resolve()
  return response


