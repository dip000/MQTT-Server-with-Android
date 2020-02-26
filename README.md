# MQTT-Server-with-Android
MQTT Messaging Server for IoT applications.

<h1>Part 1. Introduction</h1>
<p>Control any IoT device via MQTT with any client!
To send a message or instruction from any person in the world to your project(s) you need a little of security and control of who, what, and     when anyone sent anything to your controlled device.</p>

<h3>First of all. Why MQTT and why i should use it?</h3>
<p>MQTT is a communication protocol made to send (publish) and receive (subscribe) messages, with a message you can command your devices from anywhere in the world to turn on a LED, turn on a motor, turn off a light bulb, move a race car, a drone, a washing machine!!..</p>

<h3>What do i need to do that washing machine control thing?</h3>
<p>4 things; a washing machine, a potency electronic system to turn it on and off, a IoT device such as arduino/wifi or ESP32, a cellphone and anything with internet (like a cellphone, again). But forgetting about the washing machine try turning on and off a LED from anywhere with just an arduino and a cellphone source: 3Dip.es.tl</p>
<p>Can be completely free, trusty and secure. Doesn't need downloadable software to your computer. Can fit in a website and a cellphone. It´s really lightweight!</p>

<h3>Limitations</h3>
<p>1) It´s only a message send-receive system, no images, no files, etc.. but, you can manage to pass messages as JSON images or maybe html raw text to build a web server</p>

<h3>Now, how does it work? </h3>
<p>First, you start the server (this app) by filling the fields (or leave everything blank for the default settings not forgetting where to publish and subscribe)<br>
Second, you must establish a valid connection to the server (this app) by sending a command with:<br> a) What are you going to do?<br>b) to what device are you going to connect?, and<br> c) Who are you? a valid user? <br><br>syntax example: $con:LED -carl<br>The example demonstrates points a) b) c) respectively.<br><br>To send a message or instruction to your target device the syntax is: Hello World! -carl<br>The example assumes that the user carl is valid and previously connected.<br><br>Lastly, the target device (the device you're controlling, a LED connected to a arduino wifi for example) must subscribe to a specific topic given by the TargetsIDTopic and the TargetCoded fields as: \nTargetsIDTopic/TargetCoded </p>

<p>If you want to just connect a device to another without questions asked, try the client-only app in the website</p>

<h1>Part 2. The test server</h1>
<p>At the initialization of this app you have a test server already ready to work but..</p>

<h3>how do i use it?</h3>
<p>First, start the server with the "Server is offline" switch.\nNow you'll see a loading sign and the "Web Console" will start to show the loading status.\n1. If you don't see anything on the web console window, that's because there's a miss-location on the firmware data, to fix it go to 3dip.es.tl/MQTT-Server-with-Android.htm and follow the steps shown to upgrade the last firmware version.\n2. If the page is stuck on Building server, Build failed, is because the server ID (internal configuration) is already taken or the default broker (test.mosquitto) is offline. To fix this issue, rebuild the server and use the default settings.</p>

<h3>Testing with a online broker</h3>
<p>Following up, after the loading finished, the web console will show you the topics that the server is publishing and subscribing and you can now click on the boxes "Users","Targets" and "Server" on which you can see the more info about this concepts.\nNow add a new user on the floating button (+), click "New user", write any name or identifier and click save. The web console now will display '->NEW INSTRUCTIONS:["Add user","name",false]' and you're ready to use it! (if shows a error restart the server and do it again)<br>Head to a online test broker such as [http://www.hivemq.com/demos/websocket-client/] and type the server name (you can see the name in the box "Server" on the front panel) and the corresponding topics as the box "Targets" shows and follow this gif<br>
https://img.webme.com/pic/3/3dip/tuto_v3.gif<br>
Congratulations!, you just tested a simple messaging application for this server, now try adding a IoT device such as Arduino Wifi or an ESP32 and start controlling the internet of things</p>

<h1>Part 3. A LED on, LED off example</h1>
<h3>Setting up the server</h3>
<p>For simplicity, the configurations will be the same as the defaults on the "Server Maker" window.</p>

<h3>Configuring a ESP32 (with javascript and mos)</h3>
<p>Now that the server is running and working, place this code on the ESP32 and run it.<br>1. Note that this assumes you know how to set up a ESP32 and just copying the code won't make it work. Head to 3dip.es.tl/Setting_up_a_ESP32.htm for further reading.<br>2. This also assumes that you know how to post-setup the ESP32 to connect it to the broker.</p>

<h3>Embrace the Internet of things</h3>
<p>Now all worked up, it's time to turn on that LED from Japan, Canada or your kitchen. But you have multiple options again, here's my vision:<br>
  1.Download a MQTT client app from the Play Store and send a "$con:LED -username" to serverName/request and then send a "LEDon -username".<br>
  2. Use a online client and do as vision 1.<br>
  3. (My favorite) Make a automated client yourself on a webpage/app and just flip a switch. See this example on 3dip.es.tl/MQTT-Client-with-Android.htm or 3dip.es.tl/MQTT-Web-Client.htm</p>

 <h1>Part 4. Command Input</h1>
 <h3>Commands and syntax for the client</h3>
 <p>$con:Target -user<br>Connects to "Target" as user "user" (you'll now receive messages from "Target").<br>$shut:Target -user<br>Disconnects from "Target" as user "user" (you'll no longer receive messages from "Target").<br>$ban:User -user<br>Bans "User" as user "user" (only if "user" is registered as SuperUser).<br>$allow:User -user<br>Unbans "User" as user "user" (only if "user" is registered as SuperUser).<br>$get:test1 -user<br>Server sends you the value stored in variable test1 (Useful when serving a webpage, web element, etc..)<br>$set:test1 -user<br>Server sends to you previously connected Target the value stored in the variable test1 (Useful when the target requires a large message to be commanded)<p>
  
<h3>Commands and syntax for the server</h3>
<p>User add, user, true\nAdds the user "user" with Admin privileges\nUser delete, user<br>Deletes the user name "user"<br>User ban, user<br>Bans user name "user"<br>User allow, user<br>Unbans user name "user"<br>Target add, target<br>Adds a target name "target"<br>Target delete, target<br>Deletes a target name "target"<br>Set settings, newSettings<br>Sets all of the server configurations (careful, a JSON syntax error or a un-setted/miss-setted key/value will make the server crash)</p>  
