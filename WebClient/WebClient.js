			var target=null;
	
			const project_LED = '<i id="actionImg" class="material-icons" onclick="toggleLED()">toggle_off</i>';
			var LEDon = false;

			const project_Messager = '<div id="webConsoleMessageBox"> </div> <div id="webConsoleMessageInput"><input type="text"></input><i onclick="MessagerSend();" class="material-icons">send</i></div><div id="webConsoleMessageButtons"><i class="material-icons"><span onclick="messageButtons(0);">person_add</span> <span onclick="messageButtons(1);">person_outline</span><span onclick="messageButtons(2);">cloud_upload</span><span onclick="messageButtons(3);">cloud_download</span><span onclick="messageButtons(4);">call</span><span onclick="messageButtons(5);">call_end</span><span onclick="messageButtons(6);">mail</span></i></div>';
			const messageFromCodes = {"404":"Target not found", "304":"Command not found", "204":"User name not found","200":"User banned","210":"You need Administrator privileges","420":"Connect first with $con:~ ", "590":"send/get not found","690":"Incorrect syntax for save command","0":"Success!"}; 
			var isMessager = false;
			
			
			function toggleLED(){
				if(LEDon == false){
					MQTTsend("LEDon -" + usrKey,publishTopic);
					$("#actionImg").text("toggle_on");
					$("#actionImg").css("color","lime");
					LEDon = true;
				}
				else{
					MQTTsend("LEDoff -" + usrKey,publishTopic);
					$("#actionImg").text("toggle_off");
					$("#actionImg").css("color","firebrick");
					LEDon = false;
				}
			}
			
			function showMessage(msg, incoming=true){
				let from = activeTarget===null? subscribeTopic : activeTarget;
				let receivedMessage = '<div><span>'+ from +'</span>'+ msg +'</div>';
				let	sentMessage = '<div style="background:#c0ffc0; margin-left:15%;"><span>'+ usrKey +'</span>'+ msg +'</div>';

				$("#webConsoleMessageBox").append(incoming===true?receivedMessage:sentMessage);
				$("#webConsoleMessageBox").scrollTop($("#webConsoleMessageBox")[0].scrollHeight);
			}
			
			function MessagerSend(){
				var input = $("#webConsoleMessageInput input").val();
				
				MQTTsend(input + " -" + usrKey,publishTopic);
				showMessage(input, false);
			}
			
			function messageButtons(n){
				let message;
				
				switch(n){
					case 0: message = "$add:~"; break;
					case 1: message = "$del:~"; break;
					case 2: message = "$save:~"; break;
					case 3: message = "$get:~"; break;
					case 4: message = "$con:~"; break;
					case 5: message = "$shut:~"; break;
					case 6: message = "$send:~"; break;
				}
				$("#webConsoleMessageInput input").val(message);
			}

	/*This script is the one uploaded to gitHub "MQTTSSL.js". Update when finished*/
			var usrKey;
			var warnings=true;
			var connectionState=false;
			var readyToResend = true;
			var responseTimeout;
			var activeTarget = null;
			
			const serverName = "server";
			const host = "tailor.cloudmqtt.com";
			const port = 31345;
			const userName = "yziinyrs";
			const userPass = "cgAduprcUNln";
			const SSL = true;
			var subscribeTopic;
			const publishTopic = serverName + "/request";
			var receivedMessage = "";
			
			window.onload = function(){
				MQTTmake();
				$("#webConsole").css("display","block");
			}
			
			function targetClick(targetName){
				switch(targetName){
					case "LED":
						$("#webConsoleControl").html(project_LED);
						target = "LED";
						break;
					case "Messager":
						$("#webConsoleControl").html(project_Messager);
						target = "Messager";
						break;
					case "Crane":
						$("#webConsoleControl").html(project_Crane);
						target = "Crane";
						break;
					default:
						sendConsoleMessage("Project not developed yet!");
				}
				$("#webConsoleAutentification").show();
				$("#webConsoleProjectList").hide();
			}
			
			function evaluateAutentification(){
				if(readyToResend === true){
					readyToResend = false;
					usrKey = $("#usrKey").val();
					subscribeTopic = serverName + "/response/" + usrKey;

					MQTTconnect();
					
					responseTimeout = setTimeout(function(){
						console.log("Server timed out!");
						sendConsoleMessage("Server timed Out");
						client.disconnect();
						readyToResend = true;
					},6000);
				}
			}
			

			
			function toggleWarnings(){
				warnings = !warnings;
			}

			function MQTTmake() {
				try{
					client = new Paho.MQTT.Client(host, port, "Client1D31gR5d3Dip" + Math.random());
					client.onConnectionLost = onConnectionLost;
					client.onMessageArrived = onMessageArrived;
				} catch(e){
					console.log("Couldn´t make client. Bad or expired host/port/topic. "+e);
				}
			}
			
			function MQTTconnect(){
				try {
				
					let options = {
						"onSuccess":onConnect,
						"onFailure":onConnectionLost
					};
					
					if(SSL === true){
						options.useSSL = true;
						options.userName = userName;
						options.password = userPass;
					}
					
					client.connect(options);
				} catch(e){
					console.log("Bad Broker options or server saturated. "+e);
				}
			}
			
			function MQTTsend(msg, destination) {
				if(connectionState == true){
					message = new Paho.MQTT.Message(msg);
					message.destinationName = destination;
					client.send(message);
				}
				else{
					console.log("Couldn´t send. Internal time out or incorrect clienting");
				}
           	}
			
			function onConnect() {
					connectionState = true;
					client.subscribe(subscribeTopic);
					console.log("Subscribed!");
					console.log("Sending key..");
					MQTTsend("$con:" + target + " -" + usrKey, publishTopic);
			}
			
			function onConnectionLost(e) {
				connectionState = false;
				console.log("Connection finished. " + e.errorMessage);
				$("#webConsoleAutentification").show();
				$("#webConsoleControl").hide();
			}
			
			function onMessageArrived(message) {
				let receivedMessage = message.payloadString;
					
				if(isMessager === true){
					if(receivedMessage in messageFromCodes){
						showMessage(messageFromCodes[receivedMessage]);
					}
					else{
						showMessage(receivedMessage);
					}
				}
				else if(isMessager === false){
					clearTimeout(responseTimeout);
					if(receivedMessage === "0"){
						console.log("Logged succesfuly!");
						$("#webConsoleAutentification").hide();
						$("#webConsoleControl").show();
						isMessager = true;
					}
					receivedMessage = "";
					readyToResend = true;
				}
			}
			
			function toText(input){
				for(code in messageFromCodes){
					if(input === code){
						return messageFromCodes[code];
					}
					else{
						return false;
					}
				}
			}
			
			function sendConsoleMessage(message){
				if(warnings == true){
					var consoleMessageInit = '<i class="material-icons">error_outline</i>&nbsp;';
					
					$("#consoleOutput").css("opacity","1");
					$("#consoleOutput").html(consoleMessageInit + message);
					setTimeout(function(){$("#consoleOutput").animate({opacity: "0"})},4000);
				}
			}
			
