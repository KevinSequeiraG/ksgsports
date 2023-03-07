//Funciones para el scroll con el logo

var $content = $('header .content'),
  $blur = $('header .overlay'),
  wHeight = $(window).height();

$(window).on('resize', function () {
  wHeight = $(window).height();
});

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function Scroller() {
  this.latestKnownScrollY = 0;
  this.ticking = false;
}

Scroller.prototype = {

  init: function () {
    window.addEventListener('scroll', this.onScroll.bind(this), false);
    $blur.css('background-image', $('header:first-of-type').css('background-image'));
  },


  onScroll: function () {
    this.latestKnownScrollY = window.scrollY;
    this.requestTick();
  },


  requestTick: function () {
    if (!this.ticking) {
      window.requestAnimFrame(this.update.bind(this));
    }
    this.ticking = true;
  },

  update: function () {
    var currentScrollY = this.latestKnownScrollY;
    this.ticking = false;


    var slowScroll = currentScrollY / 2,
      blurScroll = currentScrollY * 2,
      opaScroll = 1.4 - currentScrollY / 400;
    if (currentScrollY > wHeight)
      $('nav').css('position', 'fixed');
    else
      $('nav').css('position', 'absolute');

    $content.css({
      'transform': 'translateY(' + slowScroll + 'px)',
      '-moz-transform': 'translateY(' + slowScroll + 'px)',
      '-webkit-transform': 'translateY(' + slowScroll + 'px)',
      'opacity': opaScroll
    });

    $blur.css({
      'opacity': blurScroll / wHeight
    });
  }
};


var scroller = new Scroller();
scroller.init();

//Funciones necesarias para el mapa

function initMap() {
  const directionsRenderer = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "red"
    },
    suppressMarkers: true
  });
  const directionsService = new google.maps.DirectionsService();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    suppressMarkers: true,
  });
  directionsRenderer.setMap(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
  } else {
    alert('Si no permite a esta pagina su ubicacion, no podra ver el mapa.');
  }

  function success(geolocalizacion) {

    lati = geolocalizacion.coords.latitude
    longi = geolocalizacion.coords.longitude

    calculateAndDisplayRoute(directionsService, directionsRenderer, lati, longi, map);
  }
}

function calculateAndDisplayRoute(directionsService, directionsRenderer, userlat, userlng, map) {
  var from = new google.maps.LatLng(userlat, userlng);
  var to = new google.maps.LatLng(9.998592622851554, -84.2652198512316);

  var directionsService = new google.maps.DirectionsService();
  var directionsRequest = {
    origin: from,
    destination: to,
    travelMode: google.maps.TravelMode["TRANSIT"],
    unitSystem: google.maps.UnitSystem.METRIC
  };

  directionsService.route(
    directionsRequest,
    (response, status) => {
      if (status == "OK") {
        directionsService.get
        directionsRenderer.setDirections(response);
      } else {
        window.alert("Directions request failed due to " + status);
      }
      var leg = response.routes[0].legs[0]

      makeMarker(leg.start_location, 'imagenes/user.png', "Aca esta usted", map);
      makeMarker(leg.end_location, 'imagenes/shopping-cart.png', 'KSG Sports', map);
    }
  );
}

function makeMarker(position, icon, title, map) {
  new google.maps.Marker({
    position: position,
    map: map,
    title: title,
    icon: icon
  });
}

//Mostrar imagenes de la galeria al dar click
(function () {
  var $lightbox = $("<div class='lightbox'></div>");
  var $img = $("<img>");
  var $caption = $("<p class='caption'></p>");

  // Add image and caption to lightbox

  $lightbox
    .append($img)
    .append($caption);

  // Add lighbox to document

  $('body').append($lightbox);

  $('.galeria img').click(function (e) {
    e.preventDefault();

    // Get image link and description
    var src = $(this).attr("data-image-hd");

    // Add data to lighbox

    $img.attr('src', src);

    // Show lightbox

    $lightbox.fadeIn('fast');

    $lightbox.click(function () {
      $lightbox.fadeOut('fast');
    });
  });

}());

//Funcion para llenar automaticamente la edad
$('#fechNac').change(function (e) {
  if ($('#fechNac').val() != '') {
    var fechaUser = new Date($('#fechNac').val());
    var dia = (fechaUser.getDate() + 1)
    var mes = (fechaUser.getMonth() + 1)
    var anio = fechaUser.getFullYear()
    var today = new Date();

    //Restamos los años
    edad = today.getFullYear() - anio;
    // Si no ha llegado su cumpleedad le restamos el año por cumplir (Los meses en Date empiezan en 0, por eso tenemos que sumar 1)
    if (mes >= (today.getMonth() + 1) && dia < (today.getDate()))
      edad--;
    $('#edad').val(edad);
  }

});

//Funcion para enviar el correo
$('#enviarCor').click(function (e) {

  const $form = document.querySelector('#form')
  const btnEnviar = document.querySelector('#Enviar-Correo-a')

  $form.addEventListener('submit', handleSubmit)

  function handleSubmit(event) {
    event.preventDefault()

    var radios = document.getElementsByName("genero");
    var gen = ''
    if (radios[0].checked) {
      gen = 'Masculino'
    } else if (radios[1].checked) {
      gen = 'Femenino'
    }

    const form = new FormData(this)
    $('#Enviar-Correo-a').attr('href', `mailto:kevinsteven.07.sg@gmail.com?subject=${$('#nombre').val()}&body=Correo: ${$('#email').val()}%0D%0AFecha de Nacimiento:${$('#fechNac').val()}%0D%0AEdad: ${$('#edad').val()}%0D%0AGenero: ${gen}%0D%0AGrado: ${$('#grado_academico').val()}`);
    btnEnviar.click()
    $('#reset').click();
  }
});

function googleTranslateElementInit() {
  new google.translate.TranslateElement({
      pageLanguage: 'es',
      includedLanguages: 'ca,eu,gl,en,fr,it,pt,de',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      gaTrack: true
  }, 'google_translate_element');
}