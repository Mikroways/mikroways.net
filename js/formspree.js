var $contactForm = $('#contact-form');
var $contactFormGlobal = $('#contact-form-global');
$contactForm.submit(function(e) {
  e.preventDefault();
  if(! $contactForm.valid()) return false;
  $.ajax({
    url: 'https://0lsny8552e.execute-api.us-east-1.amazonaws.com/dev/crm/',
    method: 'POST',
    data: $(this).serialize(),
    dataType: 'json',
    beforeSend: function() {
      $contactFormGlobal.find('.alert-success').hide();
      $contactFormGlobal.find('.alert-danger').hide();
      $('<div class="alert alert-info">Enviando mensaje...</div>').insertBefore("#contact-form");
    },
    success: function(data) {
      $contactFormGlobal.find('.alert-info').hide();
      $('<div class="alert alert-success">¡Gracias por contactarnos! Responderemos tu mensaje en breve.</div>').insertBefore("#contact-form");
    },
    error: function(err) {
      $contactFormGlobal.find('.alert-info').hide();
      $('<div class="alert alert-danger">El mensaje no se pudo enviar. Por favor, volvé a intentarlo.</div>').insertBefore("#contact-form");
    }
  });
});
