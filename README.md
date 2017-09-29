# Raspberry Pi CEC Controller with SmartThings

This project uses a Raspberry Pi and [cec-utils](http://manpages.ubuntu.com/manpages/precise/man1/cec-client.1.html) to turn most TVs on or off. I connected it to SmartThings to avoid opening up the device to the public Internet and the integrations provided by SmartThings. This also allows for it to be controlled via Google Assistant, Alexa, IFTTT, and any other SmartThings integration.

# Supplies

- Raspberry Pi with network access
- HDMI cable to connect the Pi and TV
- SmartThings hub

# Setup
### The Pi
This will get your Raspberry Pi running a webserver (via Node.js and Express) with two endpoints.
- POST http://localhost:3000/on - This will send a CEC On command to a connected HDMI device
- POST http://localhost:3000/off - This will send a CEC Off command to a connected HDMI device

After following the setup steps, this can be tested on the Pi or from any device on the network using an HTTP client such as `curl`, `wget`, or `Postman`.

1. Install [Raspbian Jessie](https://www.raspberrypi.org/downloads/raspbian/). I used the NOOBS guide for simplicity.
2. Install [Node.js 6 for Debian](https://nodejs.org/en/download/package-manager/).
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```
3. Install [cec-utils]([cec-utils](https://launchpad.net/ubuntu/precise/+package/cec-utils))
```
sudo apt-get install -y cec-utils
```
4. Clone this repo, install the dependencies, and run the index file.
```
git clone git@github.com:pan1cz/rpi-cec-switch.git
cd rpi-cec-switch
npm install
node index.js
```
5. Set the Node app to auto-start
I did this via crontab
```
sudo crontab -e
```
Add this line
```
@reboot /usr/bin/node /home/pi/rpi-cec-switch/index.js &
```
### SmartThings Integration
This will create a button in SmartThings to interact with the Raspberry Pi webserver using this [HTTP Button by Chancsc on Github](https://github.com/chancsc/SC_SmartThings)

1. Setup and login to the [Smartthings Graph API](https://graph.api.smartthings.com/).
2. In the Graph API, add this [HTTP_Button_Creator](https://github.com/chancsc/SC_SmartThings/blob/master/IR-Remote/smartapps/HTTP_Button_Creator.groovy) SmartApp
    1. Navigate to My SmartApps
    2. Click the New SmartApp button
    3. Click the "From Code" option and paste the Groovy code for the HTTP Button Creator and save
3. In the Graph API, add this [HTTP Button](https://github.com/chancsc/SC_SmartThings/blob/master/IR-Remote/device-handler/HTTP_Button.groovy) Device Handler
    1. Navigate to My Device Handlers
    2. Click the Create New Device Handler button
    3. Click the "From Code" option and paste the Groovy Code for the HTTP Button and save
4. In the SmartThings mobile app, create a button device using the new handler we just created
    1. Navigate to Automation > SmartApps > Scroll to the bottom of the list and tap the `Add a SmartApp` button
    2. Scroll to the bottom of the list of SmartApps and tap the `My Apps` button
    3. Tap the HTTP Button Creator app
    4. Enter a name for the new button device (I used TV 1) and select your hub
5. Configure the newly created button
    1. Navigate to My Home > Things and tap the icon of the new button 
    2. Enter the IP of your Raspberry Pi and the port (3000 unless you changed it)
    3. In the URL Path for ON option, type `/off` *NOTE: this is an issue with the device template used above and might be fixed in the future*
    4. In the POST or GET option, select POST

Test out the new SmartThings button by tapping the "Push" icon and check the terminal of the Raspberry Pi. You should see a message about an off request being received and hopefully your TV shuts off!

# Next Steps

The sky is the limit (or really, SmartThings). I immediately connected mine to IFTTT and Google Assistant to receive a sassy response when exerting my laziness.

## TODO
- Write a better HTTP Button handler to be more intuitive, implement ON functionality, and get current TV status
- Troubleshooting guide
