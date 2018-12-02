// todo add thumbnail preview of image
// on image details modal

// might want to re-init on each upload attempt
// so that the values from any previous upload
// attempts are not left filled in
var imageDetailsFormData = {
  isShown : false,

  imageTitle : '',
  imageTitleErrors : [],

  imageDescription : '',
  imageDescriptionErrors : [],

  imageTag1 : '',
  imageTag1Errors : [],

  imageTag2 : '',
  imageTag2Errors : [],

  imageTag3 : '',
  imageTag3Errors : []
};

var modalData = {
  isModalShown: false,
  currentModal: null
};

var imageUploadInfo;


function initializeImageDetails() {
  imageDetailsFormData.imageTitle = '';
  imageDetailsFormData.imageDescription = '';
  imageDetailsFormData.imageTag1 = '';
  imageDetailsFormData.imageTag2 = '';
  imageDetailsFormData.imageTag3 = '';

  emptyErrorsArray(
    imageDetailsFormData.imageTitleErrors
  );
  emptyErrorsArray(
    imageDetailsFormData.imageDescriptionErrors
  );
  emptyErrorsArray(
    imageDetailsFormData.imageTag1Errors
  );
  emptyErrorsArray(
    imageDetailsFormData.imageTag2Errors
  );
  emptyErrorsArray(
    imageDetailsFormData.imageTag3Errors
  );

  return;
} // initializeImageDetails


// todo: prefix title, description, etc
// with imageDetails.
// todo: return validation result
// with errors arrays
function validateImageDetails(
  imageDetails
) {
  let validImageDetails = true;

  // todo: more on constraints

  // todo: constants in a js file at root
  var MIN_IMAGE_TITLE_LENGTH = 8;
  var MAX_IMAGE_TITLE_LENGTH = 127;

  if (
    imageTitle.length <= MIN_IMAGE_TITLE_LENGTH
  ) {
    imageTitleErrors.push(
      'title is too short: must be at least '
      + MIN_IMAGE_TITLE_LENGTH
      + ' characters'
    );

    validImageDetails = false;
  }

  if (
    imageTitle.length >= MAX_IMAGE_TITLE_LENGTH
  ) {
    imageTitleErrors.push(
      'title is too long: must be no more than '
      + MAX_IMAGE_TITLE_LENGTH
      + ' characters'
    );

    validImageDetails = false;
  }


  // todo: constants in a js file at root
  var MIN_IMAGE_DESCRIPTION_LENGTH = 8;
  var MAX_IMAGE_DESCRIPTION_LENGTH = 127;

  if (
    imageDescription.length <= MIN_IMAGE_DESCRIPTION_LENGTH
  ) {
    imageDescriptionErrors.push(
      'description is too short: must be at least '
      + MIN_IMAGE_DESCRIPTION_LENGTH
      + ' characters'
    );

    validImageDetails = false;
  }

  if (
    imageDescription.length >= MAX_IMAGE_DESCRIPTION_LENGTH
  ) {
    imageDescriptionErrors.push(
      'description is too long: must be no more than '
      + MAX_IMAGE_DESCRIPTION_LENGTH
      + ' characters'
    );

    validImageDetails = false;
  }

  return true;
} // validateImageTag

function validateImageTag(
  imageTag
) {
  if (
    imageTag === ''
  ) {
    // tags are optional
    // a tag being an empty string is invalid
    // and will not be sent to server
    // (!! todo: confirm with matt !!)
    // but is not an error on the form
    // that needs to be corrected
    return false;
  }

  //
  // todo: constraints

  return true;
} // validateImageTag

function onConfirmImageDetailsButtonPressed(
  event
) {
  event.preventDefault();

  // clean first?

  let imageDetails = {
    imageTitle: imageDetailsFormData.imageTitle,
    imageDescription: imageDetailsFormData.imageDescription
  };

  // todo: extract values from form data,
  // clean them, and then update form data
  // with cleaned values

  // imageDetailsFormData.

  let validImageDetails = validateImageDetails(
    imageDetails
  );


  if (
    !validImageDetails
  ) {
    // early exit
    // todo: show form error modal
    showFormErrorModal();

    return;
  }


  if (
    imageTag1IsValid
  ) {
    imageDetails.tag1 = imageTag1;
  }

  if (
    imageTag2IsValid
  ) {
    imageDetails.tag2 = imageTag2;
  }

  if (
    imageTag3IsValid
  ) {
    imageDetails.tag3 = imageTag3;
  }

  // check for duplicate tags?


  // todo: move into its own function
  let payload = {
    imageDetails: imageDetails,
    info: imageUploadInfo
  };

  postStuffToServer(
    payload,
    '/upload-image/'
  )
  .then(
    ( response ) => {
      console.log( 'received response from server' );
      console.log( response );

      let parsedResponse = JSON.parse( response );

      //alert( "Your upload was successful! Here is it's url: " + parsedResponse.secure_url );
    } // response callback
  );

  return false;
} // onConfirmImageDetailsButtonPressed

function onCancelImageDetailsButtonPressed(
  event
) {
  event.preventDefault();

  hideImageDetails();

  // todo: have server delete uploaded image?

  imageUploadInfo = null;

  return; //? or use throw error?
} // onCancelImageDetailsButtonPressed


function showImageDetails() {
  console.log( 'enter showImageDetails' );

  modalData.isModalShown = false;

  imageDetailsFormData.isShown = true;

  console.log( 'exit showImageDetails' );
} // showImageDetails
function hideImageDetails() {
  console.log( 'enter hideImageDetails' );

  imageDetailsFormData.isShown = false;

  console.log( 'exit hideImageDetails' );
} // hideImageDetails



function showLoadingModal() {
  modalData.currentModal = MODALS.LOADING;
  modalData.isModalShown = true;

  return;
} // showLoadingModal
function hideLoadingModal() {
  modalData.isModalShown = false;

  return;
} // hideLoadingModal


// todo move into common.js after
// matt is done working with login page
Vue.component(
  'modal',
  {
    template: `
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">

              <div class="modal-header">
                <slot name="header">
                </slot>
              </div>

              <div class="modal-body">
                <slot name="body">
                </slot>
              </div>

              <div class="modal-footer">
                <slot name="footer">
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition>
    `
  }
);



const MODALS = {
  LOADING: 'loading-modal',
  //FORM_ERROR: 'form-error-modal',
  //FAIL_RESULT: 'fail-result-modal',
  //SUCCESS_RESULT: 'success-result-modal'
}
Vue.component(
  MODALS.LOADING,
  {
    template: `
      <modal>
        <h2 slot="header">
          Loading
        </h2>

        <p slot="body">
          sending credentials to server
        </p>

        <p slot="footer">
          please wait
        </p>
      </modal>
    `
  }
);




function onUploadWidgetEvent(
  error, // optional
  result
) {
  if ( error ) {
    console.error(
      'error from cloudinary widget:'
    );
    console.error(
      error
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

  return;
} // onImageAdded

function onUploadSuccess( result ) {
  console.log( 'successfully uploaded image' );
  console.log( result.info );

  uploadWidget.hide();

  imageUploadInfo = result.info;

  // todo thumbnail url for image details

  initializeImageDetails();
  showImageDetails();

  return;
} // onUploadSuccess


var vueRoot = new Vue(
  {
    el: '#app-container',
    data: {
      imageDetailsFormData: imageDetailsFormData,
      modalData: modalData
    }
  }
);


var uploadWidget = cloudinary.applyUploadWidget(
  '#upload_widget_opener',
  {
    cloudName: 'hws6kskjw',
    uploadPreset: 'rywvoxo2',
    cropping: true,
    folder: 'user_images'
  },
  onUploadWidgetEvent
);
