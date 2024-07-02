const LAUNCH_BUTTON = document.getElementById('launchbutton');

const launchClient = async () => {
    LAUNCH_BUTTON.textContent = 'Launching...';

    const response = await fetch("/application/launch", {
        method: 'POST',
    });

    if (response.status >= 400) {
        alert('Could not launch osu! client');
        LAUNCH_BUTTON.textContent = 'Launch osu!';
        return;
    }

    LAUNCH_BUTTON.textContent = 'Launched!';
    LAUNCH_BUTTON.style.display = 'none'; // Hide the button after launching

}