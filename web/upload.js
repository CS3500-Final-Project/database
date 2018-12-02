/*/
  var myUploadWidget;
  document.getElementById("upload_widget_opener")
  .addEventListener(
    "click",
    function() {
      myUploadWidget = cloudinary.openUploadWidget(
        {
          cloudName: 'hws6kskjw',
          uploadPreset: 'rywvoxo2'
        },
        ( error, result ) => {        }, false
      );
    }
  ); // addEventListener
//*/

var imageDetails = {
  title: '',
  description: '',
  tag1: '',
  tag2: '',
  tag3: ''
};
// todo vue stuff and form errors

function showImageDetailsModal() {
  console.log( 'enter showImageDetailsModal' );
  console.log( 'exit showImageDetailsModal' );
} // showImageDetailsModal
function hideImageDetailsModal() {
  console.log( 'enter hideImageDetailsModal' );
  console.log( 'exit hideImageDetailsModal' );
} // hideImageDetailsModal

function onUploadWidgetEvent(
  error, // optional
  result
) {
  if ( error ) {
    console.error(
      'error from cloudinary widget'
    );

    uploadWidget.close();

    return;
  }

  if ( result && result.event ) {
    // handle result event based on event type
    switch ( result.event ) {
      case 'upload-added': {
        onImageAdded( result );
      } // upload-added
      break;

      case 'success': {
        onUploadSuccess( result );
      } // success
      break;

      default: {
        console.log( 'unhandled event type' );
        console.log( result );
      } // default
    } // switch result event
  } // result

  return;
} // onUploadWidgetEvent

function onImageAdded( result ) {
  console.log( 'upload added' );
  console.log( result.info );

  //uploadWidget.hide();

  showImageDetailsModal();
} // onImageAdded

function onUploadSuccess( result ) {
  console.log( 'successfully uploaded image' );
  console.log( result.info );

  let payload = {
    imageDetails: imageDetails,
    info: result.info
  };

  postStuffToServer(
    payload
  )
  .then(
    ( response ) => {
      // response might be text (a JSON string)
      // or it could be an object...
      // I was getting JSON strings even with
      // the headers set up to return JSON
      console.log( 'received response from server' );
      console.log( response );

      let parsedResponse = JSON.parse( response );

      alert( "Your upload was successful! Here is it's url: " + parsedResponse.secure_url );
    } // response callback
  );
} // onUploadSuccess

var uploadWidget = cloudinary.applyUploadWidget(
  '#upload_widget_opener',
  {
    cloudName: 'hws6kskjw',
    uploadPreset: 'rywvoxo2',
    cropping: true,
    folder: 'user_images',
    inlineContainer: '#upload-widget-container'
  },
  onUploadWidgetEvent
);


