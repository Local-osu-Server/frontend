const OSU_CLIENT_SERVICE_ROOT_URL = "http://localhost:5001";
const LAUNCH_CLIENT_URL = `${OSU_CLIENT_SERVICE_ROOT_URL}/application/launch`;

const LAUNCH_BUTTON = document.getElementById('launchbutton');


const launchClient = async () => {
    LAUNCH_BUTTON.textContent = 'Launching...';

    let response;
    try {
        response = await axios.post(LAUNCH_CLIENT_URL);
    } catch (error) {
        alert('Could not launch osu! client: ' + error.response);
        LAUNCH_BUTTON.textContent = 'Launch osu!';
        return;
    }

    if (response.status >= 400) {
        alert('Could not launch osu! client: ' + error.response.data.error_message);
        LAUNCH_BUTTON.textContent = 'Launch osu!';
        return;
    }

    LAUNCH_BUTTON.textContent = 'Launched!';
    LAUNCH_BUTTON.style.display = 'none'; // Hide the button after launching

}