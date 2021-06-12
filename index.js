var rpc = require("discord-rpc")
const client = new rpc.Client({ transport: 'ipc' })

/**
 * Logging in file is not yet implemented. It is used as a placeholder
 */
const loggingOptions = {
    none: 0,
    inConsole: 1,
    inFile: 2,
    inFileAndConsole: 3,
}
const loggingMode = loggingOptions.inConsole;

const refreshTime = 10; //Refresh interval in seconds
let currentIndex = -1;
//Insert your application ID here
const defaultAppId = "852680799799214080";
let activeAppId = -1;

/**
 * Insert your details, texts, images and buttons here. 
 * Every Status must be seperated with a ","
 * Possible attributes: 
 * details: string
 * text: string
 * image: string
 * buttons: [{label: string, url: string}]
 * appId: string
 */
const statusContentList = [
    { details: "Not giving up", text: "Never gonna let you down", image: "scraxicon", buttons: [{ label: "Important Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }] },
    { details: "Baiting people", text: "Baiting you!", image: "scraxicon", buttons: [{ label: "Bait", url: "https://youtu.be/d1YBv2mWll0" }] },
    { details: "Playing games", text: "Actually not", image: "scraxicon", appId: "852697412421287946" }
]

const log = (logMessage) => {
    switch (loggingMode) {
        case loggingOptions.none:
            break;
        case loggingOptions.inConsole:
            console.log(logMessage);
            break;
        case loggingOptions.inFile:
            //Logging in file
            break;
        case loggingOptions.inFileAndConsole:
            console.log(logMessage);
            //Logging in file
            break;
    }
}
const getActivity = ({ details, text, buttons, image }) => {
    if (buttons) {
        return {
            details: details || "no details given...",//Status Details
            assets: {
                large_image: image, //Image name that is set in the application
                large_text: text || "No text given..." // THIS WILL SHOW AS "Playing <Status>" from the outisde
            },
            buttons: buttons,
        }
    }
    return {
        details: details || "no details given...",//Status Details
        assets: {
            large_image: image, //Image name that is set in the application
            large_text: text || "No text given..." // THIS WILL SHOW AS "Playing <Status>" from the outisde
        }
    }
}

const updateStatusTo = (statuscontent) => {
    log("Setting status to" + JSON.stringify(statuscontent));
    client.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: getActivity(statuscontent)
    })
}

const updateStatus = () => {
    const currentStatusContent = statusContentList[currentIndex];
    updateStatusTo(currentStatusContent);
}

const loginIfNeeded = (appId, onLogin) => {
    console.log("appID", appId);
    if (!appId) {
        activeAppId = defaultAppId;
    }
    if (appId == activeAppId) {
        return;
    }
    if(appId){
        activeAppId = appId;
    }

    console.log("Logging in", activeAppId);
    //clientId => Discord ApplicationID
    client.login({ clientId: activeAppId }).catch(() => {
        log(`Failed to login with the applicationID '${activeAppId}', trying '${defaultAppId}'.`);
        client.login({ clientId: defaultAppId }).catch(() => {
            log(`Failed to login with the applicationID '${defaultAppId}'.`);
        }).then(()=>{
            onLogin();
        })
    }).then(()=>{
        onLogin();
    })
}

const update = () => {
    const newIndex = Number.parseInt(Math.random() * statusContentList.length);
    if (newIndex == currentIndex) return; //canceling method if newIndex = currentIndex
    currentIndex = newIndex;
    loginIfNeeded(statusContentList[currentIndex].appId, updateStatus);
}

const start = () => {
    //needed for instant start
    update();
    setInterval(() => {
        update();
    }, refreshTime * 1000); //timeout in seconds
}
start();


//Doesn't change the game yet :c