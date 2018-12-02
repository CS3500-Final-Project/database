
var formData = {
  username : '',
  usernameErrors : [],

  password : '',
  passwordErrors : []
};

var modalData = {
  isModalShown: false,
  currentModal: null
};



function attemptToLogin() {
  // remove old username and password errors
  for (
    let i = formData.usernameErrors.length;
    i > 0;
    i--
  ) {
    formData.usernameErrors.pop();
  }
  for (
    let i = formData.passwordErrors.length;
    i > 0;
    i--
  ) {
    formData.passwordErrors.pop();
  }

  // convert to combined promises?
  // probably not necessary to do
  // username and password processing
  // asynchronously since the process
  // does not take long
  let processedUsername = removeUnacceptableCharacters(
    formData.username.trim()
  );
  let processedPassword = removeUnacceptableCharacters(
    formData.password.trim()
  );
  // should form data be updated with
  // the cleaned values?

  let credentials = {
    username: processedUsername,
    password: processedPassword
  };

  // todo validation
  let credentialsValidationResults =  validateCredentials( credentials );

  if (
    credentialsValidationResults.validity === CREDENTIALS_VALIDATION_RESULT_TYPES.INVALID
  ) {
    credentialsValidationResults.usernameErrors
    .forEach(
      formData.usernameErrors.push
    );

    credentialsValidationResults.passwordErrors
    .forEach(
      formData.passwordErrors.push
    );

    showErrorModal();

    return;
  }


  postStuffToServer(
    credentials,
    '/login/'
  )
  .then(
    function( response ) {
      hideLoadingModal();

      console.log( 'server response: ' + response );
    }
  )
  .catch(
    function(
      reason
    ) {
      console.error( reason );
    } // reject callback
  );

  return;
} // attemptToLogin



function onLoginButtonPressed(
  event
) {
  console.log( 'login button pressed' );
  event.preventDefault();

  attemptToLogin();

  return false;
} // onLoginButtonPressed


function showFormErrorModal() {
  currentModal = MODALS.FORM_ERROR;
  modalData.isModalShown = true;

  return;
} // showFormErrorModal
function hideFormErrorModal() {
  modalData.isModalShown = false;

  return;
} // hideFormErrorModal


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
  FORM_ERROR: 'form-error-modal',
  FAIL_RESULT: 'fail-result-modal',
  SUCCESS_RESULT: 'success-result-modal'
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
  MODALS.FORM_ERROR,
  {
    template: `
      <modal>
        <h2 slot="header">
          Errors in Form
        </h2>

        <p slot="body">
          please correct the fields with errors
        </p>

        <div slot="footer">
          <button onclick="onDismissErrorModal">
            Return to form
          </button>
        </div>
      </modal>
    `
  }
);
Vue.component(
  MODALS.FAIL_RESULT,
  {
    template: `
      <modal>
        <h2 slot="header">
          Login Failed
        </h2>

        <p slot="body">
          todo: show errors
        </p>

        <div slot="footer">
          <button onclick="onDismissFailResultModal">
            Return to form
          </button>
        </div>
      </modal>
    `
  }
);
Vue.component(
  MODALS.SUCCESS_RESULT,
  {
    template: `
      <modal>
        <h2 slot="header">
          Login Successful
        </h2>

        <p slot="body">
          Welcome back
        </p>

        <div slot="footer">
          <a href="./details.html>
            Continue to account
          </a>
        </div>
      </modal>
    `
  }
);


var vueRoot = new Vue(
  {
    el: '#app-container',
    data: {
      formData: formData,
      modalData: modalData
    }
  }
);

