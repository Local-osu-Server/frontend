//const axios = require('axios');

const OSU_CLIENT_SERVICE_ROOT_URL = "http://localhost:5001";
const API_SERVER_SERVICE_ROOT_URL = "http://localhost:5000";


const OSU_FOLDER_PATH_URL_LINK = `${OSU_CLIENT_SERVICE_ROOT_URL}/application/path`;
const API_SERVER_CONFIGURATION_UPDATE_URL = `${API_SERVER_SERVICE_ROOT_URL}/api/v1/config/update`;
const KILL_CLIENT_URL = `${OSU_CLIENT_SERVICE_ROOT_URL}/application/kill`;

const sendData = async () => {
    alert(
        "Please wait while we update the configuration. This may take a few seconds. You will be redirected to the dashboard once the configuration is updated."
    )

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

        if (key === 'dedicated_dev_server_domain') {
            // only get the "domain.com" part not the "https://"
            // if the user enters "https://domain.com" or "http://domain.com"
            // and if they give us "domain.com" we don't have to do anything
            const domain = value.replace("https://", "").replace("http://", "").replace("/", "");
            configBody[key] = domain;
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
    let osu_folder_path_response;
    try {
        osu_folder_path_response = await axios.get(OSU_FOLDER_PATH_URL_LINK);
    } catch (error) {
        alert(error.response.data.error_message);
        return;
    }

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
        alert(error.response.data.error_message);
        return
    }

    const api_server_update_configuration_response_data = api_server_update_configuration_response.data;

    // Send the specific error message that the server sends
    if (api_server_update_configuration_response.status >= 400) {
        alert(api_server_update_configuration_response_data.error_message);
        return;
    }

    // now kill the client

    let kill_response;

    try {
        kill_response = await axios.post(KILL_CLIENT_URL);
    } catch (error) {
        alert(error.response.data.error_message);
        return;
    }

    const kill_response_data = kill_response.data;

    if (kill_response.status >= 400) {
        alert(kill_response_data.error_message);
        return;
    }

    // redirect to the dashboard
    window.location.href = "/";
};