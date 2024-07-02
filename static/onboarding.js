const OSU_PATH_URL_LINK = "http://localhost:5001/osu_path/";
const API_SERVER_CONFIGURATION_UPDATE_URL = "http://localhost:5000/api/v1/config/update";
const KILL_CLIENT_URL = "http://localhost:5001/application/kill";

const sendData = async () => {
    const form = document.querySelector('form');
    const formData = new FormData(form);

    const jsonObject = {};

    for (const [key, value] of formData.entries()) {
        jsonObject[key] = value;
    }

    const osu_path_response = await fetch(OSU_PATH_URL_LINK);

    if (osu_path_response.status >= 400) {
        alert("Could not get osu! path because osu! isn't opened.");
        return;
    }

    const osu_path_data = await osu_path_response.json();
    jsonObject['osu_path'] = osu_path_data.osu_path;

    // update api server configuration
    const api_server_update_configuration_response = await fetch(API_SERVER_CONFIGURATION_UPDATE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonObject)
    });

    const api_server_update_configuration_response_data = await api_server_update_configuration_response.json();

    // Send the specific error message that the server sends
    if (api_server_update_configuration_response.status >= 400) {
        alert(api_server_update_configuration_response_data.error_message);
        return;
    }

    // now kill the client
    const kill_response = await fetch(KILL_CLIENT_URL, {
        method: 'POST'
    });

    const kill_response_data = await kill_response.json();

    if (kill_response.status >= 400) {
        alert(kill_response_data.error_message);
        return;
    }

    // redirect to the dashboard
    window.location.href = "/";
};