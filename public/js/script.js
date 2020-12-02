'use strict';
$('#hamburgerIcon').on('click', ()=>{
  $('#linksBlock').slideToggle();
});

$('#updateForm').hide();

$('#updateBtn').on('click', ()=>{
  $('#updateForm').slideToggle();
});

$('#closeBtn').on('click', ()=>{
  $('#updateForm').slideToggle();
});
