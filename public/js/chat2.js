//  Author: Ben Rogers: ben@alexaninnovation.com
//  http://www.alexaninnovation.com

function sendFeedback(action, intent, rootControlID) {
    var likeControl = document.getElementById('like-' + rootControlID);
    var dislikeControl = document.getElementById('dislike-' + rootControlID);
    var likeControlCurrentStatus = (likeControl.className == "feedback-text-clicked") ? 'clicked' : 'unclicked';
    var dislikeControlCurrentStatus = (dislikeControl.className == "feedback-text-clicked") ? 'clicked' : 'unclicked';
    var specificAction = (action == 'like') ? 'like' : 'dislike';
    var likeClick = (specificAction == 'like' && likeControlCurrentStatus == 'unclicked') ? true : false;
    var dislikeClick = (specificAction == 'dislike' && dislikeControlCurrentStatus == 'unclicked') ? true : false;
    // the four specific actions:
    var newLikeToDislike = (dislikeClick && likeControlCurrentStatus == 'clicked') ? true : false;
    var newDislikeToLike = (likeClick && dislikeControlCurrentStatus == 'clicked') ? true : false;
    var newLike = (likeClick && !newDislikeToLike) ? true : false;
    var newDislike = (dislikeClick && !newLikeToDislike) ? true : false;
    var removeLike = (specificAction == 'like' && likeControlCurrentStatus == 'clicked');
    var removeDislike = (specificAction == 'dislike' && dislikeControlCurrentStatus == 'clicked');
    var feedbackAction = 'none';
    if (newLikeToDislike) { feedbackAction = 'like-to-dislike' };
    if (newDislikeToLike) { feedbackAction = 'dislike-to-like' };
    if (newLike) { feedbackAction = 'new-like' };
    if (newDislike) { feedbackAction = 'new-dislike' };
    if (removeLike) { feedbackAction = 'remove-like' };
    if (removeDislike) { feedbackAction = 'remove-dislike' };


    if (action == 'like') {
        likeControl.className = (likeControlCurrentStatus == "clicked") ? "feedback-text" : "feedback-text-clicked";
        // ivf they've liked something, always remove the dislike.
        dislikeControl.className = 'feedback-text';
    } else if (action == 'dislike') {
        dislikeControl.className = (dislikeControlCurrentStatus == "clicked") ? "feedback-text" : "feedback-text-clicked";
        // ivf they've disliked something, always remove the like.
        likeControl.className = 'feedback-text';

    }

    var convID = document.getElementById('convoid').val
    var theDate = Date.now();
    var queryString = jQuery.deparam(window.location.search);
    var lang = (queryString.lang && queryString.lang == "ES") ? "ES" : "EN";


    params = { "action": feedbackAction, intent: intent, convoID: convID, datetime: theDate, lang: lang };
    socket.emit('feedback', params, function (err) {

    });



}
var socket = io(); // making req from client to server to open up a websocket and keep it open.


socket.on('connect', function () {
    var theDate = Date.now();
    var params = { queryString: jQuery.deparam(window.location.search), eventDateTime: theDate };
    socket.emit('join', params, function (err) {

        if (err) {
            console.log(err);
        }
    });



});

socket.on('socketID', function (message) {
    document.getElementById('convoid').val = message;
});


// New Message FROM server

socket.on('newMessage', function (message) {
    var textToShow = message.text
    var textToShowArray = textToShow.split("|");
    var feedbackRootID = message.createdAt;

    var botNameHTML = '<b>DSIA</b><br>';

    for (var i = 0; i < textToShowArray.length; i++) {
        var specificRootID = feedbackRootID + i;
        var feedbackLikeID = 'like-' + specificRootID;
        var feedbackDislikeID = 'dislike-' + specificRootID;

        if (i == (textToShowArray.length - 1)) {
            var feedbackLikeHTML = "&nbsp;<a href=\"#\" class=\"feedback-text\" title=\"I like this\" onclick=\"sendFeedback(\'like\',\'" + message.intent + "\',\'" + specificRootID + "\')\" id=\"" + feedbackLikeID + "\">👍</a>";
            var feedbackDislikeHTML = "&nbsp;<a href=\"#\" class=\"feedback-text\" title=\"I don\'t like this\" onclick=\"sendFeedback(\'dislike\',\'" + message.intent + "\',\'" + specificRootID + "\')\" id=\"" + feedbackDislikeID + "\">👎</a>";
            textToShowArray[i] = botNameHTML + textToShowArray[i] + feedbackLikeHTML + feedbackDislikeHTML;
        } else {
            textToShowArray[i] = botNameHTML + textToShowArray[i];
        }
    }

    chatWindow.talk(
        {
            "response": {
                says:
                    textToShowArray,
                reply: message.replies
            }
        },
        "response"
    );

});

socket.on('disconnect', function () {
    // do nothing (server cleans up)
});



var theDate = Date.now();
var params = { queryString: jQuery.deparam(window.location.search), eventDateTime: theDate };





