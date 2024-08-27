import functools
import json
import os
import time
import reflex as rx
import Backend.spotify as spotify

class Login_state(rx.State):
    authorization_code: str = rx.LocalStorage('')
    access_code: str = rx.LocalStorage('')
    # refresh_token: str = rx.LocalStorage('')
    
    @rx.var
    def parse_URI(self):
        self.authorization_code = self.router.page.params.get("code")
        if self.authorization_code != '':
            self.access_code = spotify.callback(self.authorization_code)

    def redirect_if_authorized(self):
        if self.authorization_code == None or self.authorization_code == '':
            return rx.redirect("/login")

    def logout(self):
        self.access_code = ''
        self.authorization_code = ''
        return rx.redirect("/login")

def login() -> rx.Component:
    return rx.center(
        rx.vstack(
            # rx.box("Login to Spotify", class_name="p-4", style={"width": "300px"}),
            rx.image(src="/landing_page.png", class_name='object-fill padding-0 bg-local h-1000 w-450'),
            rx.image(src="/sound.gif", class_name='absolute translate-y-1/4 object-fill padding-0 z-1'),
            rx.link("Login", href=spotify.get_auth_URI(), class_name="btn btn-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 "),
        ),
    )