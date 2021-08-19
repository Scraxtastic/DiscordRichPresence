var rpc = require("discord-rpc");
const { RPCCommands } = require("discord-rpc/src/constants");
const fs = require('fs');

let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);
let client;
// client = new rpc.Client({ transport: 'ipc' })
// let clientConnected = false;
let corrupted = false;
let random = (min, max) => Math.random() * (max - min) + min;
const startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * random(5,15)));

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
const refreshTime = config.refreshTime;

/**
 * this needs to be filled. This is used as a fallback, if no appId is given in the statusConentListItem
 */
const defaultAppId = config.defaultAppId;

const defaultImage = config.defaultImage;

/**
 * TODO Forcechange if the random number is equal to the current index
 */
const forceChange = config.forceChange;

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
 *  appId: string {currently not supported}
 * }
 */
const statusContentList = config.statusContentList;


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
const getActivity = ({ details, text, buttons, image, timestamp}) => {
    if (buttons) {
        return {
            details: details || "no details given...",
            assets: {
                large_image: image || defaultImage, //Image name that is set in the application
                large_text: text || "No text given..." // this will show as "Playing <Status>" from the outisde
            },
            buttons: buttons,
            timestamps: config.timestamp? { start: Math.round(startTime.getTime()) }: {},
        }
    }
    return {
        details: details || "no details given...",
        assets: {
            large_image: image || defaultImage, //Image name that is set in the application
            large_text: text || "No text given..." // this will show as "Playing <Status>" from the outisde
        },
        timestamps: config.timestamp? { start: Math.round(startTime.getTime()) }: {},
    }
}

/**
 * updates the Status
 */
const updateStatus = () => {
    if (!client?.transport?.socket) {
        console.debug(client);
        corrupted = true;
        console.log("CORRUPTED");
    } else {
        console.log("NOT CORRUPTED");
    }
    if (corrupted) {
        log("Current Client is corrupted. Not setting the status");
        return;
    }
    const currentStatusContent = statusContentList[currentIndex];
    log("Setting status to" + JSON.stringify(currentStatusContent));
    console.log(JSON.stringify(client.user));
    // console.log("client", client == true, client.user, client.user.setActivity);
    // client?.user?.
    // setActivity('TEST', { type: "WATCHING" })
    client.request(RPCCommands.SET_ACTIVITY, {
        pid: process.pid,
        activity: getActivity(currentStatusContent)
    })
}

let lastTime = new Date().getTime();

/**
 * Tries to login into the Application
 * @param {string} appId 
 * @returns 
 */
const loginTo = async (appId) => {
    //TODO destroy to be able to connect to another application
    // if (client && client.transport) {
    //     const getMethods = (obj) => {
    //         let properties = new Set()
    //         let currentObj = obj
    //         do {
    //             Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    //         } while ((currentObj = Object.getPrototypeOf(currentObj)))
    //         return [...properties.keys()].filter(item => typeof obj[item] === 'function')
    //     }
    //     // console.log(getMethods(client.transport.socket));
    //     // console.log(client.transport.socket.address());
    //     log("Destroying current Client");
    //     // console.log("socket", client.transport.socket);
    //     // await client.transport.removeAllListeners();
    //     // await client.transport.socket.removeAllListeners();
    //     // await client.transport.socket.end();
    //     // await client.transport.socket.destroy();
    //     // client._connectPromise = undefined;
    //     // console.log("transport", client.transport);
    //     // await client.destroy();
    // }
    if (!client || corrupted) {
        log("Creating new Client.");
        client = new rpc.Client({ transport: 'ipc' });
        corrupted = false;
    }
    log("Logging in " + appId);
    log(new Date().getTime() - lastTime);
    lastTime = new Date().getTime();
    return await client.login({ clientId: appId }).catch((error) => {
        log(`Failed to login with the applicationID '${appId}'.`);
        // console.error(error);
    })
}



/**
 * Logs into the Discord Application to change the game status
 * @param {string} appId 
 * @returns 
 */
const loginIfNeeded = async (appId) => {
    // if (appId == activeAppId) {
    //     return;
    // }
    // if (!appId) {
    //     if (activeAppId == defaultAppId) {
    //         return;
    //     }
    //     activeAppId = defaultAppId;
    // }
    // if (appId) {
    //     activeAppId = appId;
    // }
    // if (client && clientConnected) {
    //     // log("Destroying " + activeAppId);
    // }
    //TODO REWORK Shall always use default rn
    activeAppId = defaultAppId;
    const activeAppLogin = await loginTo(activeAppId);

    if (!activeAppLogin) {
        log(`Failed to Login to ${activeAppId}. Trying ${defaultAppId}.`);
        activeAppId = defaultAppId;
        await loginTo(activeAppId);
    }
    clientConnected = true;
}

/**
 * updates the application and status details
 */
const update = async () => {
    try {
        const newIndex = Number.parseInt(Math.random() * statusContentList.length);
        // TOODO forceChange
        // if (!forceChange)
        //     log("The current run has no changes. Waiting for next run.");
        if (newIndex == currentIndex) return;
        currentIndex = newIndex;
        await loginIfNeeded(statusContentList[currentIndex].appId);
        updateStatus();
    } catch (error) {
        console.error("myError", error);
    }
}

/**
 * updates the application and status details after the given refreshtime
 */
const start = async () => {
    //needed for instant start
    await update();
    setInterval(async () => {
        await update();
    }, refreshTime * 1000);
}
// Initially starts the RPC Software
start();