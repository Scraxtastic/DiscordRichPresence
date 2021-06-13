# DiscordRichPresence

This is my modified version of the Custom Discord Rich Presence (Custom Discord RPC) software. 
(This software works on windows, but i didn't test it for Linux yet)

## Requirements
- `Node.js` has to be installed.
- `NPM` (Node Package Manager) has to be installed
- `npm install` must've been executed

## Modify the software for the own purposes

The values in the region between the 2 Important comments may be edited without impact on the logic.
The `defaultAppId` should be filled with an existing app, because it is used as a fallback appid. 
The software might not work as intended if this value is `null`, `undefined` or wrong.

The second interesting part is `statusContentList`. 
You can add values with the given patterns. It should include atleast 1 value.

## Start the software

Navigate to the folder of the `Discord Rich Presence` repository.
Run `node .\index.js` in your command prompt.
It should now run in the command prompt.


### Make the Command Prompt closable

Nobody likes useless opened windows, that are needed to be open.
I recommend you to use the `forever` package.
simply install it with `npm install forever -g`.
you can now start the `index.js` with `forever start index.js`.
The command prompt should close, after starting the `index.js` with node.

The batch file `startDiscordStatusForever.bat` already includes the startup command.

## Add the software to the autostart, so that it starts automagically if you start your PC

Open the autostart folder. For that press `Win+R` and type in `shell:startup`, confirm with `Enter`.
Click on `New` and add a `shortcut`. Insert the path of the `startDiscordStatusForever.bat` file.
The PC should start the software automagically, as soon as your PC starts.

## Stopping the processes

You can use `taskkill /im node.exe -f` to stop all node processes. 
It could trigger side effects.

## Have fun using the discord RPC tool :D