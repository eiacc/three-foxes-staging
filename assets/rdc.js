"use strict;"

//Toggle info box on the Labels are of the customizer pages
const labelArea = document.querySelector('.ctm__labels_content_area');

if(labelArea) {
  // const section = document.querySelector('.ctm_pro_customizer');
  const infoBtn = document.querySelector('.tf-up-info');
  const closeBtn = document.querySelector('.tf-up-info-close');
const infoTextBox = document.querySelector('.upload-btn-text');

const toggleInfoTextBox = function (e) {
  if(this.classList.contains('tf-up-info-close')) {
    infoTextBox.classList.add('rdc-d-none');
    
  } else {
    infoTextBox.classList.remove('rdc-d-none');
  }
}

infoBtn.addEventListener('click',toggleInfoTextBox);
closeBtn.addEventListener('click',toggleInfoTextBox);
}
