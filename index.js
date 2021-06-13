var rpc = require("discord-rpc")
// the client is needed in multiple functions
let client;

/**
 * Logging in file is not yet implemented. It is used as a placeholder
 */
const loggingOptions = {
    none: 0,
    inConsole: 1,
    inFile: 2,
    inFileAndConsole: 3,
}


/**
 * ----------------------------------IMPORTANT----------------------------------
 * The values below can and should be edited. 
 * Do not change values behind the next marker.
 */

/**
 * Sets the loggingMode for the Application
 */
const loggingMode = loggingOptions.inConsole;

/**
 * Refresh interval in seconds
 */
const refreshTime = 10;

/**
 * this needs to be filled. This is used as a fallback, if no appId is given in the statusConentListItem
 */
const defaultAppId = "852680799799214080";

/**
 * TODO Forcechange if the random number is equal to the current index
 */
const forceChange = false;

/**
 * Insert your details, texts, images and buttons, that shall be shown in the discord client here. 
 * For more information read the README.md file (https://github.com/Scraxtastic/DiscordRichPresence).
 * Every Status must be seperated with a ","
 * Possible attributes: 
 * {
 *  details: string
 *  text: string
 *  image: string
 *  buttons: [{label: string, url: string}]
 *  appId: string
 * }
 */
const statusContentList = [
    { details: "Not giving up", text: "Never gonna let you down", image: "scraxicon", buttons: [{ label: "Important Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }] },
    { details: "Baiting people", text: "Baiting you!", image: "scraxicon", appId: "853439830146416650", buttons: [{ label: "Bait", url: "https://youtu.be/d1YBv2mWll0" }] },
    { details: "Playing games", text: "Actually not", image: "scraxicon", appId: "852697412421287946" }
]


/**
 * ----------------------------------IMPORTANT----------------------------------
 * DO NOT CHANGE VALUES BELOW THIS UNLESS YOU ARE A DEVELOPER
 */


// Used as placeholders for the initial values
let currentIndex = -1;
let activeAppId = -1;


/**
 * Logs the logMessage in the given logginOption
 * @param {string} logMessage 
 */
const log = (logMessage) => {
    switch (loggingMode) {
        case loggingOptions.none:
            break;
        case loggingOptions.inConsole:
            console.log(logMessage);
            break;
        case loggingOptions.inFile:
            //TODO Logging in file
            break;
        case loggingOptions.inFileAndConsole:
            console.log(logMessage);
            //TODO Logging in file
            break;
    }
}

/**
 * Returns the activitiy with or without buttons, depending on the statusContentListItem
 * @param {details: string, text: string, buttons: [{label: string, url: string}], image: string} param0 
 * @returns the activity
 */
const getActivity = ({ details, text, buttons, imageName }) => {
    if (buttons) {
        return {
            details: details || "no details given...",
            assets: {
                large_image: imageName, //Image name that is set in the application
                large_text: text || "No text given..." // this will show as "Playing <Status>" from the outisde
            },
            buttons: buttons,
        }
    }
    return {
        details: details || "no details given...",
        assets: {
            large_image: imageName, //Image name that is set in the application
            large_text: text || "No text given..." // this will show as "Playing <Status>" from the outisde
        }
    }
}

/**
 * updates the Status
 */
const updateStatus = () => {
    const currentStatusContent = statusContentList[currentIndex];
    log("Setting status to" + JSON.stringify(currentStatusContent));
    client.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: getActivity(currentStatusContent)
    })
}

/**
 * Tries to login into the Application
 * @param {string} appId 
 * @returns 
 */
const loginTo = async (appId) => {
    log("Logging in " + appId);
    client = new rpc.Client({ transport: 'ipc' })
    return client.login({ clientId: appId }).catch(() => {
        log(`Failed to login with the applicationID '${appId}'.`);
    })
}

/**
 * Logs into the Discord Application to change the game status
 * @param {string} appId 
 * @returns 
 */
const loginIfNeeded = async (appId) => {
    if (appId == activeAppId) {
        return;
    }
    if (!appId) {
        activeAppId = defaultAppId;
    }
    if (appId) {
        activeAppId = appId;
    }
    if (client) {
        log("Destroying", activeAppId);
        await client.destroy();
    }
    client = new rpc.Client({ transport: 'ipc' })
    const activeAppLogin = await loginTo(activeAppId);
    if (!activeAppLogin) {
        activeAppId = defaultAppId;
        await client.destroy();
        await loginTo(activeAppId);
    }
}

/**
 * updates the application and status details
 */
const update = async () => {
    const newIndex = Number.parseInt(Math.random() * statusContentList.length);
    if (!forceChange)
        log("The current run has no changes. Waiting for next run.");
    if (newIndex == currentIndex) return;
    currentIndex = newIndex;
    await loginIfNeeded(statusContentList[currentIndex].appId);
    updateStatus();
}

/**
 * updates the application and status details after the given refreshtime
 */
const start = () => {
    //needed for instant start
    update();
    setInterval(() => {
        update();
    }, refreshTime * 1000);
}
// Initially starts the RPC Software
start();