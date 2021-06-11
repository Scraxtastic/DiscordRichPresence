# DiscordRichPresence

This is my modified version of the Custom Discord Rich Presence (Custom Discord RPC) software. 
(This software works on windows, but i didn't test it for Linux yet)

## Requirements
- `Node.js` has to be installed.
- `NPM` (Node Package Manager) has to be installed
- `npm install` must've been executed

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
