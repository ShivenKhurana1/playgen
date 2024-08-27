# Moodify

Moodify is a project developed for LA Hacks 2024 that aims to enhance the user experience by providing a personalized soundtrack for their memories. By leveraging the Spotify API for authentication and song data, and the Google Gemini Pro Vision API for identifying semantics, Moodify offers a unique way for users to connect with their favorite songs through their photos.

## Features

- **Personalized Soundtrack:** Moodify matches the user's photo input with songs from their Mixes, providing a personalized soundtrack for their memories.
- **Authentication:** Users can securely authenticate their Spotify account to access their favorite songs.
- **Semantics Identification:** The Google Gemini Pro Vision API is used to identify semantics in the user's photos, enhancing the matching process.

## Technologies Used

- **Reflex Web Framework:** Used for developing the web application, providing a smooth and interactive user interface.
- **Spotify API:** Used for authentication and accessing the user's favorite songs.
- **Google Gemini Pro Vision API:** Used for identifying semantics in the user's photos.

## Team Members

- [**Leo Lee**](https://www.linkedin.com/in/thl-leo/)
- [**Daphne Cheng**](https://www.linkedin.com/in/daphne--cheng/)
- [**Ryan Da**](https://www.linkedin.com/in/ryan-da/)
- [**Yoshi Nakachi**](https://www.linkedin.com/in/yoshinakachi/)

## How to Install

To install and run Moodify, follow these steps:

1. Set up a Python virtual environment using venv:
```bash
python3 -m venv myenv
source myenv/bin/activate
```
2. Clone the Moodify repository:
```bash
git clone https://github.com/your-username/moodify.git
cd LAHacks
```
3. Install the required Python packages:
```bash
pip install -r requirements.txt
```
4. Start the server using Reflex:
```bash
reflex run
```

## How to Use

To use Moodify, follow these steps:

1. Sign in with your Spotify account to access your favorite songs.
2. Upload a photo that represents a memory or moment.
3. Moodify will match the photo with a song from your favorite list, creating a personalized soundtrack for your memory.

## Future Enhancements

- Training Gemini and expanding the semantics pool for better matching accuracy.
- Adding social sharing features to allow users to share their personalized soundtracks with friends.
- Make a standalone social media app using cross platform languages such as Flutter or React Native

## Feedback

We welcome any feedback or suggestions for improving Moodify. Feel free to reach out to us with your thoughts!
