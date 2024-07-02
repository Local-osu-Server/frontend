from fastapi import Request
from fastapi.routing import APIRouter
from fastapi.templating import Jinja2Templates

frontend_router = APIRouter()

templates = Jinja2Templates(directory="./pages")


@frontend_router.get("/")
async def dashboard(
    request: Request,
):
    # TODO: check if the user is authenticated
    return templates.TemplateResponse(
        name="dashboard.html",
        context={"request": request},
    )


@frontend_router.get("/onboarding")
async def onboarding(
    request: Request,
):
    return templates.TemplateResponse(
        name="onboarding.html",
        context={"request": request},
    )
