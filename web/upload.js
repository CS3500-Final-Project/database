// todo add thumbnail preview of image
// on image details modal

// might want to re-init on each upload attempt
// so that the values from any previous upload
// attempts are not left filled in
var imageDetailsFormData = {
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
    return;
  }


  if (
    imageTag1IsValid
  ) {
    imageDetails.tag1 = imageTag1;
  }

  if (
    imageTag1IsValid
  ) {
    imageDetails.tag1 = imageTag1;
  }

  if (
    imageTag1IsValid
  ) {
    imageDetails.tag1 = imageTag1;
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

  hideDetailsModal();

  // todo: have server delete uploaded image?

  imageUploadInfo = null;

  return; //? or use throw error?
} // onCancelImageDetailsButtonPressed



function showLoadingModal() {
  modalData.currentModal = MODALS.LOADING;
  modalData.isModalShown = true;

  return;
} // showLoadingModal
function hideLoadingModal() {
  modalData.isModalShown = false;

  return;
} // hideLoadingModal

function showImageDetailsModal() {
  console.log( 'enter showImageDetailsModal' );

  modalData.currentModal = MODALS.IMAGE_DETAILS;
  modalData.isModalShown = true;

  console.log( 'exit showImageDetailsModal' );
} // showImageDetailsModal
function hideImageDetailsModal() {
  console.log( 'enter hideImageDetailsModal' );

  modalData.isModalShown = false;

  console.log( 'exit hideImageDetailsModal' );
} // hideImageDetailsModal



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
  IMAGE_DETAILS: 'image-details-modal',
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
Vue.component(
  MODALS.IMAGE_DETAILS,
  {
    template: `
      <modal>
        <h2 slot="header">
          Enter some details about the image
        </h2>

        <p slot="body">
          <form>
            <div id="image-title-field"
              v-bind:class="
                ( imageDetailsFormData.imageTitleErrors.length )
                ? 'form-field form-field-with-error'
                : 'form-field'
              " >
              <label for="image-title" >
                <span>
                  Image title:
                </span>

                <input id="image-title-control"
                  type="text"
                  name="image-title"
                  v-model="imageDetailsFormData.imageTitle"
                  required />
              </label><!-- image-title -->

              <ul id="image-title-errors-display"
                v-if="imageDetailsFormData.imageTitleErrors.length" >
                <li v-for="error in imageDetailsFormData.imageTitleErrors" >
                  <p>
                    {{ error }}
                  </p>
                </li>
              </ul>
            </div><!-- image-title-field -->

            <div id="image-description-field"
              v-bind:class="
                ( imageDetailsFormData.imageDescriptionErrors.length )
                ? 'form-field form-field-with-error'
                : 'form-field'
              " >
              <label for="image-description" >
                <span>
                  Image description:
                </span>

                <input id="image-description-control"
                  type="text"
                  name="image-description"
                  v-model="imageDetailsFormData.imageDescription"
                  required />
              </label><!-- image-description -->

              <ul id="image-description-errors-display"
                v-if="imageDetailsFormData.imageDescriptionErrors.length" >
                <li v-for="error in imageDetailsFormData.imageDescriptionErrors" >
                  <p>
                    {{ error }}
                  </p>
                </li>
              </ul>
            </div><!-- image-description-field -->

            <div id="image-tag1-field"
              v-bind:class="
                ( imageDetailsFormData.imageTag1Errors.length )
                ? 'form-field form-field-with-error'
                : 'form-field'
              " >
              <label for="image-tag1" >
                <span>
                  Image tag 1:
                </span>

                <input id="image-tag1-control"
                  type="text"
                  name="image-tag1"
                  v-model="imageDetailsFormData.imageTag1" />
              </label><!-- image-tag1 -->

              <ul id="image-tag1-errors-display"
                v-if="imageDetailsFormData.imageTag1Errors.length" >
                <li v-for="error in imageDetailsFormData.imageTag1Errors" >
                  <p>
                    {{ error }}
                  </p>
                </li>
              </ul>
            </div><!-- image-tag1-field -->

            <div id="image-tag2-field"
              v-bind:class="
                ( imageDetailsFormData.imageTag2Errors.length )
                ? 'form-field form-field-with-error'
                : 'form-field'
              " >
              <label for="image-tag2" >
                <span>
                  Image tag 2:
                </span>

                <input id="image-tag2-control"
                  type="text"
                  name="image-tag2"
                  v-model="imageDetailsFormData.imageTag2" />
              </label><!-- image-tag2 -->

              <ul id="image-tag2-errors-display"
                v-if="imageDetailsFormData.imageTag2Errors.length" >
                <li v-for="error in imageDetailsFormData.imageTag2Errors" >
                  <p>
                    {{ error }}
                  </p>
                </li>
              </ul>
            </div><!-- image-tag2-field -->

            <div id="image-tag3-field"
              v-bind:class="
                ( imageDetailsFormData.imageTag3Errors.length )
                ? 'form-field form-field-with-error'
                : 'form-field'
              " >
              <label for="image-tag3" >
                <span>
                  Image tag 3:
                </span>

                <input id="image-tag3-control"
                  type="text"
                  name="image-tag3"
                  v-model="imageDetailsFormData.imageTag3" />
              </label><!-- image-tag -->

              <ul id="image-tag3-errors-display"
                v-if="imageDetailsFormData.imageTag3Errors.length" >
                <li v-for="error in imageDetailsFormData.imageTag3Errors" >
                  <p>
                    {{ error }}
                  </p>
                </li>
              </ul>
            </div><!-- image-tag-field -->

            <button id="confirm-image-details-button"
              onclick="return onConfirmImageDetailsButtonPressed( event );" >
              confirm details
            </button>

            <button id="cancel-image-details-button"
              onclick="return onCancelImageDetailsButtonPressed( event );" >
              cancel upload
            </button>
          </form>
        </p>

        <div slot="footer">
        </div>
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

  showImageDetailsModal();

  return;
} // onImageAdded

function onUploadSuccess( result ) {
  console.log( 'successfully uploaded image' );
  console.log( result.info );

  uploadWidget.hide();

  imageUploadInfo = result.info;

  // todo thumbnail url for image details modal

  initializeImageDetails();
  showImageDetailsModal();

  return;
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


var vueRoot = new Vue(
  {
    el: '#app-container',
    data: {
      imageDetailsFormData: imageDetailsFormData,
      modalData: modalData
    }
  }
);
