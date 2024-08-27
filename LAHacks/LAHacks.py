"""Welcome to Reflex! This file outlines the steps to create a basic app."""

from rxconfig import config
from Backend.gemini import image_mood_generator
import reflex as rx
from reflex.components.el import iframe
import PIL.Image
from LAHacks.Login import *
from Backend.spotify import *
from .loading_icon import loading_icon

docs_url = "https://reflex.dev/docs/getting-started/introduction/"
filename = f"{config.app_name}/{config.app_name}.py"



class State(rx.State):
    """The app state."""

    # The images to show.
    img_name: list[str] = []
    tracks: list[tuple[str, str, str]] = []
    # Whether there are images.
    has_img: bool = False
    processing: bool = False
    mood: str = ""

    async def handle_upload(self, files: list[rx.UploadFile]):
        """Handle the upload of file(s).

        Args:
            files: The uploaded files.
        """
        self.processing = True
        for file in files:
            upload_data = await file.read()
            outfile = rx.get_upload_dir() / file.filename

            # Save the file.
            with outfile.open("wb") as file_object:
                file_object.write(upload_data)

            # Get the width and height of the image
            with PIL.Image.open(outfile) as img:
                width, height = img.size

            # Update the img var.
            self.img_name.append((file.filename, width, height))
        # Update the has_img var because images are uploaded
        self.has_img = True

        image_paths = [str(rx.get_upload_dir() / img[0]) for img in self.img_name]
        self.tracks, self.mood = await spotify.get_playlists(image_paths)
        self.processing = False

        # Call image_mood_generator with the uploaded images
        # For simplicity, assuming image_mood_generator takes a list of image paths
        # self.results = result.candidates[0].content.parts[0].text

    async def clear_images(self):
        """Clear the list of images."""
        # Clear the list of images and set has_img to False
        self.img_name.clear()
        self.has_img = False
        self.tracks.clear()
        
        

    # async def info(self):
    #     login_state = await self.get_state(Login_state)
    #     headers = {
    #         'Authorization': f"Bearer {login_state.access_code}"
    #     }
    # passes in access token through headers
        # response = requests.get('https://api.spotify.com/v1/me', headers=headers)

    # async def renew(self):
    #     login_state = await self.get_state(Login_state)
    #     login_state.access_code = await spotify.renew_token(login_state.refresh_token)

    # async def call_gemini(self, input_list, width, height):
    #     """Call the gemini API."""
    #     return image_mood_generator(input_list, width, height)


color = "rgb(107,99,246)"
embed = "<iframe style=\"" + "border-radius:12px\"" + " src=\"" + "https://open.spotify.com/embed/track/" 
embed2 = "?utm_source=generator\" " + "width=\"" + "100%\" " + "height=" + "\"152\" " + "frameBorder=" + "\"0\" " + "allowfullscreen=\"\"" + " allow=\"" + "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture\" " + "loading=" + "\"lazy\"" + "></iframe>"

url_fstr = 'https://open.spotify.com/embed/track/{track_id}?utm_source=generator'
embed_fstr = '<iframe style="border-radius:12px" src={src_url} width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>'

def index():
    """The main view."""
    return rx.center(
                rx.vstack(
                    rx.cond(
                        State.has_img,
                        rx.grid(
                            rx.foreach(
                                State.img_name,
                                lambda img: rx.vstack(
                                    rx.image(src=rx.get_upload_url(img[0])),
                                    rx.text(img[0]),
                                    align="center",
                                ),
                            ),
                            columns="1",
                            spacing="1",
                        ),
                        rx.center(
                        rx.upload(
                                rx.cond(
                                    State.processing,
                                    loading_icon(height="1em"),
                                    rx.vstack(
                                        rx.button(
                                            rx.icon(tag="image"),
                                            color_scheme="jade", width="15vw", height="10vh",),
                                            #"Select File", color=color, bg="white", border=f"1px solid {color}"),
                                        rx.text("Upload from Device", class_name="text-gray-100 lg:text-2xl md:text-lg sm:text-md "),
                                    ),
                                ),
                            id="upload2",
                            multiple=False,
                            accept = {
                                "image/png": [".png"],
                                "image/jpeg": [".jpg", ".jpeg"],
                                "image/heic": [".heic"],
                            },
                            max_files=1,
                            disabled=False,
                            on_keyboard=True,
                            on_drop=State.handle_upload(rx.upload_files(upload_id="upload2", multiple=False)),
                            border=f"5px solid {color}",
                            padding="5em",
                            align="center",
                            height="50vh",
                            width="50vw",
                            border_color= rx.color("gray", 2),
                        ),
                        ),
                    ),
                    rx.hstack(
                        rx.button(
                            "Clear",
                            color_scheme="jade",
                            on_click= State.clear_images(),
                        ),
                        rx.button(
                            "Logout",
                            color_scheme="jade",
                            on_click= Login_state.logout(),
                        ),
                    ),
                    rx.grid(
                        rx.foreach(
                            State.tracks,
                            lambda song: iframe(src=url_fstr.format(track_id=song[2]), class_name='object-fill h-300 w-150') # rx.html((embed_fstr.format(src_url= song[2]))),
                        ),
                    columns="1",
                    spacing="0",
                    class_name = 'resize-y',
                ),

                    padding="5em",
                    align="center", 
                    background_color=rx.color("gray", 12),
                    min_height="100vh", 
                    min_width="100vw",            
                ),
                align="center",
            )

app = rx.App()
app.add_page(index, route = '/', on_load=Login_state.redirect_if_authorized)
app.add_page(login, route = '/login')
