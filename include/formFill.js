// Fill out the appointment form dynamically based on pre-set values
async function fillAppointmentForm() {
  console.log("Filling out the appointment form.");

  const userInput = {
    location: "Islamabad",
    visaType: "National Visa",
    visaSubType: "Study",
    appointmentCategory: "Normal",
  };

  // Map user inputs to dropdown options
  const selectedValues = selectDynamicValues(userInput);

  // Get visible form divs
  const resultDivs = getVisibleDivsWithMb3WithoutHiddenClasses();

  await sleep(500); // Initial delay before starting the process
  await fillFormDynamically(resultDivs, selectedValues);

  // Notify the form completion
  setTimeout(() => {
    chrome.runtime.sendMessage({ action: "formFilled" });
  }, 300);
}

// Map user input to corresponding dropdown values
function selectDynamicValues(userInput) {
  const dropdownOptions = {
    Location: ["Islamabad", "Karachi", "Lahore", "Multan", "Quetta"],
    VisaType: ["National Visa", "Tourist Visa"],
    VisaSubType: ["Study", "Work"],
    AppointmentCategory: ["Normal", "Premium"],
  };

  // Map user input to dropdown values using a helper function
  const mapValue = (key, value) =>
    dropdownOptions[key]?.find((option) => option === value) || null;

  return {
    Location: mapValue("Location", userInput.location),
    VisaType: mapValue("VisaType", userInput.visaType),
    VisaSubType: mapValue("VisaSubType", userInput.visaSubType),
    AppointmentCategory: mapValue(
      "AppointmentCategory",
      userInput.appointmentCategory
    ),
  };
}

// Dynamically fill the form by selecting dropdown values
async function fillFormDynamically(resultDivs, selectedValues) {
  for (const div of resultDivs) {
    const label = div.querySelector("label[for]");
    if (label) {
      const dropdownId = label.getAttribute("for");
      let value;

      if (dropdownId.includes("Location")) {
        value = selectedValues["Location"];
      } else if (dropdownId.includes("VisaType")) {
        value = selectedValues["VisaType"];
      } else if (dropdownId.includes("VisaSubType")) {
        value = selectedValues["VisaSubType"];
      } else if (dropdownId.includes("AppointmentCategory")) {
        value = selectedValues["AppointmentCategory"];
      }

      if (value) {
        await selectItemFromDropdown(dropdownId, value);
        await sleep(700); // Add a delay between selecting items
      }
    }
  }
}

// Select an item from a dropdown based on its ID and value
async function selectItemFromDropdown(dropdownId, value) {
  const locationLabelId = `${dropdownId}_label`;
  const label = document.getElementById(locationLabelId);
  const dropdown = label.nextElementSibling;

  // Click the dropdown to open it
  dropdown.click();

  const randomDelay = Math.floor(Math.random() * (1000 - 600 + 1)) + 600;

  // Wait for the dropdown options to appear
  await sleep(randomDelay);

  const listbox = document.getElementById(
    locationLabelId.replace("label", "listbox")
  );

  const items = listbox.querySelectorAll("li.k-item");

  for (let item of items) {
    if (item.textContent.trim() === value) {
      item.click();
      break;
    }
  }
}

// Get visible divs within the form excluding hidden ones
function getVisibleDivsWithMb3WithoutHiddenClasses() {
  const hiddenClasses = getClassesWithDisplayNone();
  const form = document.querySelector('form[action="/Global/bls/VisaType"]');
  if (!form) return [];

  const divsWithMb3 = form.querySelectorAll("div.mb-3");

  return Array.from(divsWithMb3).filter((div) => {
    const divClasses = Array.from(div.classList);
    const hasHiddenClass = divClasses.some((cls) =>
      hiddenClasses.includes(cls)
    );

    const isHidden =
      window.getComputedStyle(div).display === "none" ||
      div.querySelector('[style*="display:none"]') !== null;

    return !hasHiddenClass && !isHidden;
  });
}

// Retrieve classes with display: none from stylesheets
function getClassesWithDisplayNone(doc = document) {
  const hiddenClasses = [];

  for (const sheet of doc.styleSheets) {
    if (!sheet.href) {
      try {
        for (const rule of sheet.cssRules) {
          if (
            rule.type === CSSRule.STYLE_RULE &&
            rule.style.display === "none"
          ) {
            const selector = rule.selectorText;
            if (selector.startsWith(".")) {
              hiddenClasses.push(selector.slice(1));
            }
          }
        }
      } catch (e) {
        console.warn("Could not access stylesheet:", sheet, e);
      }
    }
  }
  return hiddenClasses;
}

// Helper function to pause execution for a given duration
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
