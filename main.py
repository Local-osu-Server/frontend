from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.logger import logger
from fastapi.staticfiles import StaticFiles

import config
from routers.frontend import frontend_router

import webbrowser

app = FastAPI()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Self-Reminders
    # Respositories: used for interacting with the data directly
    # Usecases: the logic of the application, repositories work with it
    # Controllers: the interface between the frontend and the usecases (the API endpoints)

    logger.info("Starting Frontend Service")

    web_path_for_css_and_javascript_files = "/static"
    directory_for_css_and_javascript_files = "./static"

    app.mount(
        web_path_for_css_and_javascript_files,
        StaticFiles(directory=directory_for_css_and_javascript_files),
        name="static",
    )

    app.include_router(frontend_router)
    
    # TODO: check if the user has never launched the project before
    # probably some call to the api to check if the user has already created a project
    
    # open default browser to the frontend
    if config.AUTO_LAUNCH_BROWSER:
        webbrowser.open(f"http://localhost:{config.PORT}", new=2)

    yield

    logger.info("Stopping Frontend Service")


app = FastAPI(lifespan=lifespan, debug=True)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        port=config.PORT,
        reload=True,
    )
