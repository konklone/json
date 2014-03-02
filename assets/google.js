var CLIENT_ID = "196458768721-u75306nieic87rbove3mvn617r60aakg.apps.googleusercontent.com";
var SCOPES = ["https://www.googleapis.com/auth/drive.file"];

var Google = {

  checkAuth: function() {
    gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      immediate: true
    }, Google.handleAuthResult);

    return false;
  },

  handleAuthResult: function(authResult) {
    if (authResult) {
      // Access token has been successfully retrieved, requests can be sent to the API
      Google.openSpreadsheet();
    } else {
      // No access token could be retrieved, force the authorization flow.
      gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        immediate: false
      }, Google.handleAuthResult);
    }
  },

  openSpreadsheet: function() {
    gapi.client.load('drive', 'v2', function() {
      console.log("Loaded client.");

      var csv = $(".csv textarea").val();
      Google.insertFile(csv, function(file) {
        if (file)
          window.open(file.alternateLink);
      });
    });
  },

  /* todo:
    function utf8_to_b64( str ) {
      return window.btoa(unescape(encodeURIComponent( str )));
    }

    function b64_to_utf8( str ) {
        return decodeURIComponent(escape(window.atob( str )));
    }
  */

  // see https://developers.google.com/drive/v2/reference/files/insert#examples
  insertFile: function(data, callback) {
    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'media', 'convert': true},
        'headers': {'Content-Type': 'text/csv'},
        'body': data});

    if (callback)
      request.execute(callback);
  }
}