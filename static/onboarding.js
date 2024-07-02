//const axios = require('axios');

const OSU_CLIENT_SERVICE_ROOT_URL = "http://localhost:5001";
const API_SERVER_SERVICE_ROOT_URL = "http://localhost:5000";


const OSU_PATH_URL_LINK = `${OSU_CLIENT_SERVICE_ROOT_URL}/osu_path`;
const API_SERVER_CONFIGURATION_UPDATE_URL = `${API_SERVER_SERVICE_ROOT_URL}/api/v1/config/update`;
const KILL_CLIENT_URL = `${OSU_CLIENT_SERVICE_ROOT_URL}/application/kill`;

const sendData = async () => {
    const form = document.querySelector('form');
    const formData = new FormData(form);

    const jsonObject = {};

    for (const [key, value] of formData.entries()) {
        jsonObject[key] = value;
    }

    /* TODO: Implement this on the other service
    const osu_path_response = await fetch(OSU_PATH_URL_LINK);

    if (osu_path_response.status >= 400) {
        alert("Could not get osu! path because osu! isn't opened.");
        return;
    }

    const osu_path_data = await osu_path_response.json();
    jsonObject['osu_path'] = osu_path_data.osu_path;*/

    // update api server configuration

    let api_server_update_configuration_response;
    try {
        api_server_update_configuration_response = await axios.post(API_SERVER_CONFIGURATION_UPDATE_URL, jsonObject,
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        alert(error.response);
        return
    }

    const api_server_update_configuration_response_data = await api_server_update_configuration_response.json();

    // Send the specific error message that the server sends
    if (api_server_update_configuration_response.status >= 400) {
        alert(api_server_update_configuration_response_data.error_message);
        return;
    }

    // now kill the client
    /* TODO: Implement this on the other service
    const kill_response = await fetch(KILL_CLIENT_URL, {
        method: 'POST'
    });

    const kill_response_data = await kill_response.json();

    if (kill_response.status >= 400) {
        alert(kill_response_data.error_message);
        return;
    }*/

    // redirect to the dashboard
    window.location.href = "/";
};