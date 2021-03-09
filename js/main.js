var myName = prompt("Enter Your Name")

if (myName==undefined || myName==""){
    myName = "iDontHaveAName:("
}

function sendMessage() {
    // get message
    var message = document.getElementById("msg").value;

    document.getElementById("msg").value = ""

    // save to firebase
    firebase.database().ref("messages").push().set({
        "sender": myName,
        "message": message
    })
}

function deleteMessage(self) {
    var messageId = self.getAttribute("data-id");

    //delete message
    firebase.database().ref("messages").child(messageId).remove();
}



document.getElementById("msg-submit").addEventListener('click', sendMessage)

// listen for messages
firebase.database().ref("messages").on("child_added", function (snapshot) {
    // show message
    var html = "";
    html += "<li id='message-" + snapshot.key + "'"

    // add class if sent by own
    if (snapshot.val().sender == myName){
        html += " class='own'>"
    }
    else{
        html += " class='other'>";
    }
    html += "<div class='msgsender'>" + snapshot.val().sender + "</div>"

    // add delete
    if (snapshot.val().sender == myName){
        html += "<button class='delete' data-id='" + snapshot.key + "' onclick='deleteMessage(this)'>"
        html += "<i class='fa fa-trash-o'></i>"
        html += "</button>"
    }
    html += snapshot.val().message + "</li>"
    document.getElementById("messages").innerHTML += html;
    document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight; 
})

firebase.database().ref("messages").on("child_removed", function (snapshot) {
    // show deleted
    document.getElementById("message-" + snapshot.key).innerHTML = "This message has been deleted"
})
