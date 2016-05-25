var $contactForm = $('#contact-form');
$contactForm.submit(function(e) {
  e.preventDefault();
  if(! $contactForm.valid()) return false;
  $.ajax({
    url: '//formspree.io/' + 'test' + '@' + 'mikroways' + '.' + 'net',
    method: 'POST',
    data: $(this).serialize(),
    dataType: 'json',
    beforeSend: function() {
      $contactForm.find('.alert-success').hide();
      $contactForm.find('.alert-danger').hide();
      $contactForm.append('<div class="alert alert-info">Enviando mensaje...</div>');
    },
    success: function(data) {
      $contactForm.find('.alert-info').hide();
      $contactForm.append('<div class="alert alert-success">¡Gracias por tu contactarnos! Responderemos tu mensaje en breve.</div>');
    },
    error: function(err) {
      $contactForm.find('.alert-info').hide();
      $contactForm.append('<div class="alert alert-danger">El mensaje no se pudo enviar. Por favor, volvé a intentarlo.</div>');
    }
  });
});
