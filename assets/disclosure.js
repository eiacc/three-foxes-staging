class Disclosure extends HTMLElement{static instances=[];constructor(){super()}connectedCallback(){this.viewport=this.closest(".drawer--instance, .layout--main-content"),Disclosure.instances.push(this),"loading"===document.readyState?window.on("DOMContentLoaded",()=>this.load()):this.load()}disconnectedCallback(){this.off("keydown.Disclosure"),this.toggle.off("click.Disclosure keydown.Disclosure focusout.Disclosure"),this.form.off("focusout.Disclosure"),this.links.off("click.Disclosure keydown.Disclosure"),this.input.off("change.Disclosure");var t=Disclosure.instances.indexOf(this);-1<t&&Disclosure.instances.splice(t,1)}load(){this.current_option=this.querySelector(".disclosure--current-option"),this.form=this.querySelector(".disclosure--form"),this.input=this.querySelector('[data-item="disclosure"]'),this.links=this.querySelectorAll(".disclosure--option"),this.toggle=this.querySelector(".disclosure--toggle"),this.type=this.getAttribute("data-type"),this.toggle_and_form_gap=8,this.window_and_form_gap=16,this.updateFormListeners(),this.showFormWhenClick(),this.hideFormWhenFocusOut(),this.setOptionOnClick(),this.updateFormPosition(),"option-picker"!==this.type&&this.optionChangeCallback()}updateFormListeners(){new ResizeObserver(()=>this.updateFormPosition()).observe(document.body),this.closest('.drawer--instance[data-side="left"]')&&window.on("theme:drawer:left:opened.Disclosure",()=>this.updateFormPosition()),this.closest('.drawer--instance[data-side="right"]')&&window.on("theme:drawer:right:opened.Disclosure",()=>this.updateFormPosition())}showFormWhenClick(){this.toggle.on("click.Disclosure keydown.Disclosure",t=>{if("keydown"!==t.type||"Enter"===t.key){t.preventDefault();const e="true"===this.toggle.getAttribute("aria-expanded");Disclosure.instances.forEach(t=>t===this?this.toggleFormDisplay(!e):t.toggleFormDisplay(!1))}})}hideFormWhenFocusOut(){this.on("focusout.Disclosure",({relatedTarget:t})=>{this.form.contains(t)||this.toggleFormDisplay(!1)}),this.on("keydown.Disclosure",({key:t})=>{"Escape"===t&&(this.toggleFormDisplay(!1),this.toggle.focus())})}setOptionOnClick(){this.links.on("click.Disclosure keydown.Disclosure",({key:t,type:e,target:s})=>{if("Enter"===t)this.toggle.focus();else if("keydown"===e)return;var i=s.dataset.value,o=s.innerHTML;this.toggleFormDisplay(!1),this.current_option.innerHTML=o,this.links.forEach(t=>t.setAttribute("aria-current",!1)),s.setAttribute("aria-current",!0),this.input.value=i,this.input.trigger("change")})}toggleFormDisplay(t){this.toggle.setAttribute("aria-expanded",t),this.form.setAttribute("data-transition-active",t)}updateFormPosition(){this.toggle_pos=this.offset(),this.updateFormYPosition(),"option-picker"!==this.type&&this.updateFormXPosition()}updateFormYPosition(){var t=this.viewport?this.viewport.offsetHeight:0,e=this.form.offsetHeight+this.toggle_and_form_gap+this.window_and_form_gap,s=this.toggle_pos.top,i=t-s-this.toggle.offsetHeight;this.form.style.top=i<e&&i<s?`-${this.form.offsetHeight+this.toggle_and_form_gap}px`:this.toggle.offsetHeight+this.toggle_and_form_gap+"px"}updateFormXPosition(){var t=(this.viewport?this.viewport.offsetWidth:0)-this.toggle_pos.left,e=this.form.offsetWidth+this.window_and_form_gap;this.form.style.right=t<=e?this.toggle.offsetWidth+this.window_and_form_gap-t+"px":"unset"}optionChangeCallback(){this.input.on("change.Disclosure",({target:t})=>{"url-redirect"===this.type?window.location.href=t.value:"localization"===this.type&&t.closest("form").submit()})}}const disclosureEl=customElements.get("disclosure-root");disclosureEl||customElements.define("disclosure-root",Disclosure);