window.fbAsyncInit = function () {
    FB.init({
        appId      : '1745285639097716',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });

};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));







// redirecciones 

function statusChangeCallback(response) {
    if (response.status === "connected") {
         window.location = "http://localhost:26368/Inicio";
    }
}
/*
function logout() {
    alert("esta por salir")
    FB.logout(function (response) {
        // user is now logged out
        console.log(response);
        //window.location = "http://localhost:26368/";
    });
}*/

function logeoExitoso() { window.location = "http://localhost:26368/Inicio"; }