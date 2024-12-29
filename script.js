
$(document).ready(function () {

    const getUrlParameter = (sParam) => {
        let sPageURL = window.location.search.substring(1),////substring will take everything after the https link and split the #/&
            sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
            sParameterName,
            i;
        let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
        sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };


    const accessToken = getUrlParameter('access_token');

    let client_id = "1857f45f61ad417cbcf55ef83a0ae517";

    let redirect_uri = encodeURIComponent("https://rubennrouge.tech/Spotify");

    const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;

    if (accessToken == null || accessToken == "" || accessToken == undefined) {
        window.location.replace(redirect);
    }

    $('#form').on('submit', function (e) {
        e.preventDefault();
        let search = $('#campo').val();
        let searchQuery = encodeURI(search);
        $.ajax({
            url: 'https://api.spotify.com/v1/search?q=' + searchQuery + '&type=track',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            success: function (response) {
                console.log(response);
                let track = response.tracks.items[0];
                console.log(track);
                let previewUrl = track.preview_url;
                if (previewUrl) {
                    $('#resultado').html(`
                        <h2>Cancion: ${track.name}</h2>
                        <img src="${track.album.images[0].url}" alt="${track.name}">
                        <p>Artista: ${track.artists[0].name}</p>
                        <p>Álbum: ${track.album.name}</p>
                        <audio controls>
                            <source src="${previewUrl}" type="audio/mpeg">
                        </audio>
                    `);
                } else {
                    $('#resultado').html(`
                        <h2>Cancion: ${track.name}</h2>
                        <img src="${track.album.images[0].url}" alt="${track.name}">
                        <p>Artista: ${track.artists[0].name}</p>
                        <p>Álbum: ${track.album.name}</p>
                        <p>Vista previa no disponible</p>
                    `);
                }
            }
        });
    });
});
