var rpc = require("discord-rpc")
const client = new rpc.Client({ transport: 'ipc' })

const refreshTime = 10; //Refresh interval in seconds
let currentIndex = -1;
//Insert your application ID here
const appId = "852697412421287946";

/**
 * Insert your details, texts, images and buttons here. 
 * Every Status must be seperated with a ","
 */
const statusContentList = [
    { details: "Not giving up", text: "Never gonna let you down", image: "scraxicon", buttons: [{ label: "Important Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }] },
    { details: "Baiting people", text: "Baiting you!", image: "scraxicon", buttons: [{label: "Bait", url: "https://youtu.be/d1YBv2mWll0"}]},
    {details: "Playing games", text: "Actually not", image: "scraxicon"}
]

const getActivity = ({ details, text, buttons, image }) => {
    if (buttons) {
        return {
            details: details || "no details given...",//Status Details
            assets: {
                large_image: image, //Image name that is set in the application
                large_text: text || "No text given..." // THIS WILL SHOW AS "Playing <Status>" from the outisde
            },
            buttons: buttons
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
    client.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: getActivity(statuscontent)
    })
}

const updateStatus = () => {
    const newIndex = Number.parseInt(Math.random() * statusContentList.length);
    if (newIndex == currentIndex) return; //canceling method if newIndex = currentIndex
    currentIndex = newIndex;
    const currentStatusContent = statusContentList[currentIndex];
    updateStatusTo(currentStatusContent);
}

client.on('ready', () => {
    //needed for instant start
    updateStatus();
    setInterval(() => {
        updateStatus();
    }, refreshTime * 1000); //timeout in seconds
})

//clientId => ApplicationID
client.login({ clientId: appId }).catch(console.error);