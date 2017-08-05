//Esto es novedad
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



// redirecciones de deslogeo
function statusChangeCallback(response) {
    if (response.status !== "connected") {
        window.location = "http://localhost:26368/";
    }
    else {

        $(document).ready(() => {
            
            $("#panel-logout").append($("<li><h4 style=\"cursor:pointer; margin-top:14px;\" class=\"text-warning \" onclick=\"logout()\">Logout</h4></li>"));

            var solicitar = { fields: 'first_name,last_name,email,photos, cover, birthday, likes ,picture' };
            

            //Solicitud de datos

            FB.api('/me', 'get', solicitar, function (response) {

                if (!response || response.error) {

                    $("#nombre").html('Ha ocurrido un error. Codigo : ' + response.error.code + ' \n' + response.error.message);

                }
                else {

                    $("#portada").attr("src", response.cover.source);
                    
                    
                    //Request de albums
                    FB.api(
                            "me/albums?limit=100",
                            function (response) {
                                if (response && !response.error) {

                                    //request por cada album obtener sus fotos.

                                    for (let i = 0 ; i < response.data.length ; i++) {

                                        //crea seccion HTML para el album y hacer append 

                                        //generar id, primera palabra del album
                                        let albumActual = response.data[i].name;
                                        let idActual = albumActual.split(" ")[0];
                                        //eliminar posible coma
                                        idActual = idActual.substring(0, idActual.length - 1);

                                        var seccion = $('<div id="' + idActual + '"> <h3 class="h3 text-center">' + albumActual + '</h3> </div>');
                                        seccion.appendTo("#fotos-display");

                                        FB.api(
                                            response.data[i].id + "?fields=photos",
                                            function (respuestaFoto) {

                                                if (respuestaFoto && !respuestaFoto.error) {

                                                    //request por cada foto obtener su URL
                                                    
                                                    if (respuestaFoto.hasOwnProperty("photos")) {
                                                        for (let j = 0; j < respuestaFoto.photos.data.length; j++) {
                                                            FB.api(
                                                                respuestaFoto.photos.data[j].id + "?fields=images",
                                                                    function (imagen) {
                                                                        if (imagen && !imagen.error) {
                                                                            $('<a href="' + imagen.images[0].source + '" download><img class="imagenFija img-rounded" src="' + imagen.images[0].source + '"></a>').appendTo("#" + idActual);
                                                                            $('<input type="checkbox" onclick="seleccionFoto()" name="' + idActual + '" value="' + imagen.images[0].source + '">').appendTo("#" + idActual);
                                                                        }
                                                                        else {
                                                                            console.log("Error" + imagen.error);
                                                                        }
                                                                    }
                                                                        );
                                                        }
                                                    }
                                                }
                                            });
                                    }
                                }
                            });
                                                
                                            
                                                    





                    $("#nombre").html(response.first_name + " " + response.last_name + ":");
                    var img = $('<br><img id="dynamic" src="' + response.picture.data.url + '">');
                    img.prependTo("#nombre");

                    $("<li><strong>Correo</strong> : " + response.email + "</li>").appendTo("#info");
                    $("<li><strong>Nacimiento</strong> : " + response.birthday + "</li>").appendTo("#info");

                    var comienzoLikes= "<li><strong>Ultimos Likes </strong> : <ul> "; 
                    for(var i = 0; i < 7 ; i++){
                        comienzoLikes += "<li>" + response.likes.data[i].name + "</li>";
                    }
                    comienzoLikes += "</ul>";

                    $(comienzoLikes).appendTo("#info");


                    $("li").css("margin-top", "5px");


                }
            });

        });
    }
}



function logout() {
    FB.logout(function (response) {        
        window.location = "http://localhost:26368/";
    })
}

misChecks = [];

function seleccionFoto() {
    //VERIFICAR

    misChecks = [];
    $('input:checked').each(function () {

        misChecks.push($(this).attr("value"));
    });

    console.log(misChecks);

    if (misChecks.length === 0) {
        $('#contenedor-descarga').css("display", "none")
        $('#descargartxt').css("display", "none")
        $('#logo-descarga').css("display", "none")

    }
    else {
        if ($('#contenedor-descarga').css("display") === "none") {


            //Si esta invisible, Parte 
            $('#contenedor-descarga').css({
                "opacity": "0",
                "display": "block",
            }).show().animate({ opacity: 1 });

            $('#descargartxt').css({
                "opacity": "0",
                "display": "block",
            }).show().animate({ opacity: 1 });
            $('#logo-descarga').css({
                "opacity": "0",
                "display": "block",
            }).show().animate({ opacity: 1 });


           
            $('#logo-descarga').hover( 
                ()=>{
                    $('#contenedor-descarga').css("background-color", "red");
                    } ,
                ()=>{
                    $('#contenedor-descarga').css("background-color", "orange");
                })



            $('#logo-descarga').click(() =>{


                $('input:checked').each(function () {
                    $(this).removeAttr("checked");
                });

                for (let i = 0; i < misChecks.length ; i++) {
                    console.log(misChecks[i]);
                    descargarURL(misChecks[i]);
                }

           
                });

        }
    }
}
            

function descargarURL(url) {
    var link = document.createElement("a");
    link.download = url;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}