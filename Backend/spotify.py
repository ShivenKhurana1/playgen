import requests
import urllib.parse
from Backend.gemini import image_mood_generator
import os

import spotipy
from spotipy import SpotifyOAuth
from dotenv import load_dotenv
from LAHacks.Login import *
import random

# information provided by spotify
# CLIENT_ID = '92195f066c464f1089b36bd63547285f'
# CLIENT_SECRET = '153058ff6ab24fa4ae2ad10341251679'
# REDIRECT_URI = 'http://localhost:3000'

# AUTH_URL = 'https://accounts.spotify.com/authorize'
# TOKEN_URL = 'https://accounts.spotify.com/api/token' # refresh token
# API_BASE_URL = 'https://api.spotify.com/v1/'

genres = {
    'chill': '37i9dQZF1EVHGWrwldPRtj',
    'happy': '37i9dQZF1EVJSvZp5AOML2',
    'sad': '37i9dQZF1EIh4v230xvJvd',
    'energetic': '37i9dQZF1EIcVD7Tg8a0MY',
    'angry': '37i9dQZF1EIgNZCaOGb0Mi',
    'carefree': '37i9dQZF1EIhLi9kYuMplo', 
    'classical': '37i9dQZF1EQn1VBR3CMMWb',
    'retro': '37i9dQZF1EIeaq4GvA0R5R',
    'euphoric': '37i9dQZF1EIduZhe5fCMGD',
}
load_dotenv()
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")
SCOPES = os.getenv("SCOPES")
AUTH_URL = os.getenv("AUTH_URL")
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")
SCOPES = os.getenv("SCOPES")
# AUTH_URL = os.getenv("AUTH_URL")
TOKEN_URL = os.getenv("TOKEN_URL") # refresh token
auth_manager = SpotifyOAuth(client_id=CLIENT_ID, client_secret=CLIENT_SECRET, redirect_uri=REDIRECT_URI, scope=SCOPES, show_dialog=True)
sp = spotipy.Spotify(auth_manager=auth_manager)

# want user to login for access token -> code sends request to spotify's authorization with our scope that gives us access to retrieve playlist later on
def get_auth_URI():
    # TOKEN_URL = os.getenv("TOKEN_URL") # refresh token
    # API_BASE_URL = os.getenv("API_BASE_URL")
    # user-read-private = get current user's profile / username    #scope = "user-read-private user-read-email playlist-read-private"
    # state = generate_random_string(16)
    
    params = {
        'client_id': CLIENT_ID,
        'response_type': 'code', # spotify documentation tells us to set us at code
        'scope': SCOPES,
        'redirect_uri': REDIRECT_URI, # on incorrect logins
        'show_dialog': True,
    }
    
    
    # auth_manager = SpotifyOAuth(client_id=CLIENT_ID, client_secret=CLIENT_SECRET, redirect_uri=REDIRECT_URI, scope=SCOPES, show_dialog=True)
    # auth_url = auth_manager.get_authorize_url()
    
    # sp = spotipy.Spotify(auth_manager=auth_manager)
    # token_info = sp.auth_manager.get_cached_token()
    # access_token = None
    # if (token_info is None):
    #     access_token = sp.auth_manager.get_access_token()
    # else:
    #     access_token = token_info['access_token']

    # return auth_url, access_token
    # return auth_url
    return f"{AUTH_URL}?{urllib.parse.urlencode(params)}"
    # return ""


# callback endpoint -> two scenarios: user logs in successfully (gain access token) or they don't (calls the callback and error)
def callback(code):
    # load_dotenv()

    # API_BASE_URL = os.getenv("API_BASE_URL")
    # req_body = {
    #     'code': code,
    #     'grant_type': 'authorization_code',
    #     'redirect_uri': REDIRECT_URI,
    #     'client_id': CLIENT_ID,
    #     'client_secret': CLIENT_SECRET
    # }

    # send to spotify
    # response = requests.post(TOKEN_URL, data=req_body)
    # return response.json()
    token_info = sp.auth_manager.get_cached_token()
    access_token = None
    if sp.auth_manager.is_token_expired(token_info):
        access_token = sp.auth_manager.get_access_token()
    else:
        access_token = token_info['access_token']
    return access_token

def get_playlist_uri(playlist_link):
    return playlist_link.split("/")[-1].split("?")[0]


async def get_playlists(img):
    raw_mood = await image_mood_generator(img)
    mood = raw_mood.candidates[0].content.parts[0].text.lower().strip(' ')
    if mood not in genres:
        mood, _ = random.choice(list(genres.items()))
    
    # print(mood, genres[mood], "https://api.spotify.com/v1/playlists/{}".format(genres[mood]))
    # playlist_name_mood = f"{mood} mix"
    # headers = {
    #     'Authorization': f"Bearer {access_token}"
    # }
    # passes in access token through headers
    # response = requests.get("https://api.spotify.com/v1/playlists/{}".format(genres[mood]), headers=headers) # stores the result of the request we send (PLAYLISTS ACHIEVED HERE)
    # now we have all playlists in json
    # mood_playlist = response.json().get('items', [])
    # print(response.json().get('tracks', []))
    # filter for special playlists with words
    # happy, sad, energetic, angry, chill, carefree, classical, retro, or euphoric.
    # mood_playlist = next((plist for plist in all_playlists if plist['name'].lower() == playlist_name_mood.lower()), None)

    tracks = []
    playlist_uri = get_playlist_uri('https://open.spotify.com/playlist/{}'.format(genres[mood]))
    for track in sp.playlist_tracks(playlist_uri, limit=10)["items"]:
        track_name = track["track"]["name"]
        track_artist = track["track"]["artists"][0]["name"]
        track_id = track["track"]["id"]
        result = track_name, track_artist, track_id
        tracks.append(result)
    return tracks, mood

    #return mood_playlist

def playlist_tracks(access_token, playlist_id): 
    headers = {
        'Authorization': f"Bearer {access_token}"
    }
    response = requests.get(f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks', headers=headers)
    tracks = response.json().get('items', [])

    return [{
         'name': track['track']['name'],
         'artist': track['track']['artists'][0],
         'album': track['track']['album']['name']
    } for track in tracks[:5]]
     

        

