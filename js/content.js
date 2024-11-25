function test(){console.log(jQuery)}async function initiateCaptchaProcess(){const e=document.getElementById("btnVerify");e?(console.log("Clicking 'Verify Selection' button."),e.click(),await delay(),waitForIframeLoad()):console.error("Verify button not found.")}async function initiateCaptchaProcess_old(){chrome.runtime.sendMessage({action:"captchaLoaded"})}async function waitForIframeLoad(){console.log("waitForIframeLoad");const e=await getIframeDocument();if(e&&(console.log("Captcha iframe loaded."),await checkCaptchaLimitExceeded())){const t=e.documentElement.outerHTML;chrome.runtime.sendMessage({action:"captchaLoaded",data:t})}}async function checkCaptchaLimitExceeded(){iframeDoc||await getIframeDocument();const e=iframeDoc.querySelector(".alert.alert-danger");if(!e||!e.textContent.includes("You have reached maximum number of captcha request"))return console.log("No captcha limit exceeded message found. Proceeding..."),!0;console.log("Captcha limit exceeded. Waiting before retrying..."),chrome.runtime.sendMessage({action:"checkCaptchaLimitExceeded"})}console.log("Content script loaded and ready to receive messages."),chrome.runtime.onMessage.addListener((async(e,t,o)=>{switch(e.action){case"startCaptchaProcess":console.log("Received start process command. Initiating captcha process."),initiateCaptchaProcess();break;case"verifyCatpcha":console.log("Received command to click captcha images."),verifyCatpcha(e.data);break;case"fillAppointmentForm":console.log("Received command to fill the appointment form."),fillAppointmentForm();break;case"checkAppointment":console.log("Checking appointment availability."),checkAppointmentAvailability();break;case"test":test();break;case"testAgain":console.log("testing again!");break;default:console.warn("Unknown action received:",e.action)}return!0}));let iframeDoc=null,iframeWin=null;function getIframeDocument(e=!1){return new Promise(((t,o)=>{iframeDoc&&iframeWin&&t(e?iframeWin:iframeDoc);let n=document.querySelector("iframe")||document.querySelector(".k-content-frame")||document.querySelector("#popup_1.k-window-content.k-window-iframecontent .k-content-frame");n?(iframeDoc=n.contentDocument||n.contentWindow.document,iframeWin=n.contentWindow,console.log(iframeWin),t(e?iframeWin:iframeDoc)):(console.error("Iframe not found."),o(!1))}))}async function verifyCatpcha(e){console.log(`catpchaData: ${e}`);const t=document.querySelector("input[name='CaptchaData']");t&&(t.value=e,document.getElementById("btnSubmit").click(),chrome.runtime.sendMessage({action:"captchaVerified"}))}async function fillAppointmentForm(){console.log("Filling out the appointment form.");const e=selectDynamicValues({location:"Islamabad",visaType:"National Visa",visaSubType:"Study",appointmentCategory:"Normal"}),t=getVisibleDivsWithMb3WithoutHiddenClasses();await sleep(500),await fillFormDynamically(t,e),setTimeout((()=>{document.getElementById("btnSubmit").click(),chrome.runtime.sendMessage({action:"formFilled"})}),300)}function selectDynamicValues(e){const t={Location:["Islamabad","Karachi","Lahore","Multan","Quetta"],VisaType:["National Visa","Tourist Visa"],VisaSubType:["Study","Work"],AppointmentCategory:["Normal","Premium"]},o=(e,o)=>t[e]?.find((e=>e===o))||null;return{Location:o("Location",e.location),VisaType:o("VisaType",e.visaType),VisaSubType:o("VisaSubType",e.visaSubType),AppointmentCategory:o("AppointmentCategory",e.appointmentCategory)}}async function fillFormDynamically(e,t){for(const o of e){const e=o.querySelector("label[for]");if(e){const o=e.getAttribute("for");let n;o.includes("Location")?n=t.Location:o.includes("VisaType")?n=t.VisaType:o.includes("VisaSubType")?n=t.VisaSubType:o.includes("AppointmentCategory")&&(n=t.AppointmentCategory),n&&(await selectItemFromDropdown(o,n),await sleep(700))}}}async function selectItemFromDropdown(e,t){const o=`${e}_label`;document.getElementById(o).nextElementSibling.click();const n=Math.floor(401*Math.random())+600;await sleep(n);const c=document.getElementById(o.replace("label","listbox")).querySelectorAll("li.k-item");for(let e of c)if(e.textContent.trim()===t){e.click();break}}function getVisibleDivsWithMb3WithoutHiddenClasses(){const e=getClassesWithDisplayNone(),t=document.querySelector('form[action="/Global/bls/VisaType"]');if(!t)return[];const o=t.querySelectorAll("div.mb-3");return Array.from(o).filter((t=>{const o=Array.from(t.classList).some((t=>e.includes(t))),n="none"===window.getComputedStyle(t).display||null!==t.querySelector('[style*="display:none"]');return!o&&!n}))}function getClassesWithDisplayNone(e=document){const t=[];for(const o of e.styleSheets)if(!o.href)try{for(const e of o.cssRules)if(e.type===CSSRule.STYLE_RULE&&"none"===e.style.display){const o=e.selectorText;o.startsWith(".")&&t.push(o.slice(1))}}catch(e){console.warn("Could not access stylesheet:",o,e)}return t}function checkAppointmentAvailability(){setTimeout((()=>{const e=document.querySelector("#addressModalHeader")?.textContent.trim();if(e&&e.includes("No Appointments Available")){const e=document.querySelector(".modal-header .btn-close");e?(e.click(),chrome.runtime.sendMessage({action:"appointmentUnavailable"})):console.error('Button with class ".btn-close" not found.')}else if(e&&e.includes("Visa Submission Address")){const e=document.querySelector(".modal-footer .btn.btn-success");e?(e.click(),chrome.runtime.sendMessage({action:"appointmentAvailable"})):console.error('OK button in ".modal-footer .btn.btn-success" not found.')}else console.warn("Unexpected modal or no modal found.")}),1e3)}function sleep(e){return new Promise((t=>setTimeout(t,e)))}function delay(){return new Promise((e=>setTimeout(e,2500*Math.random()+1500)))}function clickOkButton(){const e=document.querySelector('.modal-footer button[type="button"]');e?(console.log("OK button found. Clicking it."),e.click()):console.warn("OK button not found.")}function findTargetNumber(){const e=Array.from(iframeDoc.querySelectorAll("div")).filter((e=>e.textContent.includes("Please select all boxes with number"))),t={};e.forEach((e=>{const o=e.textContent.match(/\d+/);o&&(t[o]=(t[o]||0)+1)}));return Object.keys(t).find((e=>2===t[e]))}function clickUsingID(e){var t=document.getElementById(e)||iframeDoc.getElementById(e);if(!t)return!1;var o=new MouseEvent("mousedown",{bubbles:!0,cancelable:!0,view:window}),n=new MouseEvent("mouseup",{bubbles:!0,cancelable:!0,view:window}),c=new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window});t.dispatchEvent(o),t.dispatchEvent(n),t.dispatchEvent(c),Select(e,t)}function getAllVisibleDivsWithImages(e=document){const t=getClassesWithDisplayNone(e),o=[];return e.querySelectorAll("#captcha-main-div div.col-4").forEach((e=>{const n=e.classList;if(!Array.from(n).some((e=>t.includes(e)))){const t=e.querySelector('img[src^="data:image/gif;base64"]');t&&o.push({id:e.getAttribute("id"),dataSrc:t.getAttribute("src")})}})),o}function clickElementByTextAcrossFrames(e,t){const o=Array.from(e.querySelectorAll("*"));for(const e of o)if(e.textContent.trim()===t)return e.click(),console.log(`Clicked on element with text: "${t}"`),!0;const n=e.querySelectorAll("iframe");for(let e=0;e<n.length;e++)try{const o=n[e].contentDocument||n[e].contentWindow.document;if(o){if(clickElementByTextAcrossFrames(o,t))return!0}}catch(e){console.warn("Error accessing iframe:",e)}return!1}