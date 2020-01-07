
var count = 0;

$(".digit").on('click', function() {
  var num = ($(this).clone().children().remove().end().text());
  if (count < 11) {
    $("#output").append('<span>' + num.trim() + '</span>');
    count++;

  }
});

$('.fa-trash-o').on('click', function() {
  $('#output span:last-child').remove();
  count--;
});
