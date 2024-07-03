//const axios = require('axios');

const OSU_CLIENT_SERVICE_ROOT_URL = "http://localhost:5001";
const API_SERVER_SERVICE_ROOT_URL = "http://localhost:5000";


const OSU_FOLDER_PATH_URL_LINK = `${OSU_CLIENT_SERVICE_ROOT_URL}/application/path`;
const API_SERVER_CONFIGURATION_UPDATE_URL = `${API_SERVER_SERVICE_ROOT_URL}/api/v1/config/update`;
const KILL_CLIENT_URL = `${OSU_CLIENT_SERVICE_ROOT_URL}/application/kill`;

const sendData = async () => {
    const form = document.querySelector('form');
    const formData = new FormData(form);

    const configBody = {};

    for (const [key, value] of formData.entries()) {
        if (
            key === 'display_pp_on_leaderboard' ||
            key === 'rank_scores_by_pp_or_score' ||
            key === 'allow_pp_from_modified_maps'
        ) {
            configBody[key] = value === 'on';
            continue;
        }

        // convert value to an int
        if (key === 'num_scores_seen_on_leaderboards' || key === "osu_api_v2_client_id") {
            configBody[key] = parseInt(value);
            continue;
        }

        configBody[key] = value;
    }

    // if display_pp_on_leaderboard or rank_scores_by_pp_or_score isn't set, set it to false
    if (!configBody.hasOwnProperty('display_pp_on_leaderboard')) {
        configBody['display_pp_on_leaderboard'] = false;
    }
    if (!configBody.hasOwnProperty('rank_scores_by_pp_or_score')) {
        configBody['rank_scores_by_pp_or_score'] = false;
    }
    if (!configBody.hasOwnProperty('allow_pp_from_modified_maps')) {
        configBody['allow_pp_from_modified_maps'] = false;
    }

    // TODO: Implement this on the other service
    const osu_folder_path_response = await axios.get(OSU_FOLDER_PATH_URL_LINK);

    if (osu_folder_path_response.status >= 400) {
        alert("Could not get osu! path because osu! isn't opened.");
        return;
    }

    configBody['osu_folder_path'] = osu_folder_path_response.data.path;

    // update api server configuration

    let api_server_update_configuration_response;
    try {
        api_server_update_configuration_response = await axios.post(API_SERVER_CONFIGURATION_UPDATE_URL, configBody,
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        alert(error.response);
        return
    }

    const api_server_update_configuration_response_data = api_server_update_configuration_response.data;

    // Send the specific error message that the server sends
    if (api_server_update_configuration_response.status >= 400) {
        alert(api_server_update_configuration_response_data.error_message);
        return;
    }

    // now kill the client
    // TODO: Implement this on the other service 
    /* 
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