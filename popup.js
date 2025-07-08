// Enhanced popup script with date conversion and time functionality
document.addEventListener("DOMContentLoaded", function () {
  console.log("Enhanced extension loaded");

  let currentYear, currentMonth;

  try {
    // Get current Nepali date
    const nepaliDate = new NepaliDate();
    console.log("NepaliDate created:", nepaliDate);

    const todayNepali = nepaliDate.format("ddd, YYYY/MM/DD", "np");
    const todayEnglish = nepaliDate.format("ddd, YYYY/MM/DD", "en");

    console.log("Nepali date:", todayNepali);
    console.log("English date:", todayEnglish);

    // Store current date values
    currentYear = nepaliDate.getYear();
    currentMonth = nepaliDate.getMonth();

    // Update date display
    document.getElementById("nepali-date").textContent = todayNepali;
    document.getElementById("english-date").textContent = todayEnglish;

    // Add event listeners for main buttons
    document.getElementById("calendar-btn").addEventListener("click", showCalendar);
    document.getElementById("converter-btn").addEventListener("click", showConverter);
    document.getElementById("time-btn").addEventListener("click", showTime);

    // Add event listeners for converter functionality
    document.getElementById("bs-to-ad-btn").addEventListener("click", convertBStoAD);
    document.getElementById("ad-to-bs-btn").addEventListener("click", convertADtoBS);
    document.getElementById("close-converter-btn").addEventListener("click", hideConverter);

    // Add event listeners for time functionality
    document.getElementById("copy-date-btn").addEventListener("click", copyDate);
    document.getElementById("copy-time-btn").addEventListener("click", copyTime);
    document.getElementById("close-time-btn").addEventListener("click", hideTime);

    // Add event listener for language toggle
    document.getElementById("language-toggle-btn").addEventListener("click", toggleLanguage);

    setInterval(updateTime, 1000); // Update every second

    // Set initial language
    loadLanguagePreference();

  } catch (error) {
    console.error("Error initializing extension:", error);
    document.getElementById("nepali-date").textContent = "Error loading date";
    document.getElementById("english-date").textContent = "Please refresh";
  }

  let currentLanguage = 'np'; // Default language

  function loadLanguagePreference() {
    chrome.storage.sync.get(['language'], function(result) {
      if (result.language) {
        currentLanguage = result.language;
      }
      updateLanguageDisplay();
    });
  }

  function toggleLanguage() {
    currentLanguage = (currentLanguage === 'np') ? 'en' : 'np';
    chrome.storage.sync.set({language: currentLanguage}, function() {
      updateLanguageDisplay();
      // Re-render elements that depend on language
      updateDateDisplay();
      updateConverterLabels();
      updateTimeLabels();
      updateCalendarLabels();
    });
  }

  function updateLanguageDisplay() {
    document.getElementById('language-toggle-btn').textContent = (currentLanguage === 'np') ? 'EN' : 'NP';
    // Update other UI elements based on language
    document.querySelector('.header h1').textContent = (currentLanguage === 'np') ? 'कति गते?' : 'Kati Gatey?';
    document.getElementById('calendar-btn').textContent = (currentLanguage === 'np') ? 'पात्रो हेर्नुहोस्' : 'View Calendar';
    document.getElementById('converter-btn').textContent = (currentLanguage === 'np') ? 'मिति रूपान्तरण' : 'Date Converter';
    document.getElementById('time-btn').textContent = (currentLanguage === 'np') ? 'समय देखाउनुहोस्' : 'Show Time';
    document.getElementById('close-converter-btn').textContent = (currentLanguage === 'np') ? 'बन्द गर्नुहोस्' : 'Close';
    document.getElementById('close-time-btn').textContent = (currentLanguage === 'np') ? 'बन्द गर्नुहोस्' : 'Close';
    document.getElementById('copy-date-btn').textContent = (currentLanguage === 'np') ? 'मिति कपी गर्नुहोस्' : 'Copy Date';
    document.getElementById('copy-time-btn').textContent = (currentLanguage === 'np') ? 'समय कपी गर्नुहोस्' : 'Copy Time';
    document.getElementById('close-calendar-btn').textContent = (currentLanguage === 'np') ? 'बन्द गर्नुहोस्' : 'Close';
  }

  function updateDateDisplay() {
    const nepaliDate = new NepaliDate();
    document.getElementById("nepali-date").textContent = nepaliDate.format("ddd, YYYY/MM/DD", "np");
    document.getElementById("english-date").textContent = nepaliDate.format("ddd, YYYY/MM/DD", "en");
  }

  function updateConverterLabels() {
    document.querySelector('#converter-container .converter-section:nth-child(1) h3').textContent = (currentLanguage === 'np') ? 'BS to AD Converter' : 'BS to AD Converter';
    document.querySelector('#converter-container .converter-section:nth-child(1) .input-group input:nth-child(1)').placeholder = (currentLanguage === 'np') ? 'वर्ष (Year)' : 'Year';
    document.querySelector('#converter-container .converter-section:nth-child(1) .input-group input:nth-child(2)').placeholder = (currentLanguage === 'np') ? 'महिना (Month)' : 'Month';
    document.querySelector('#converter-container .converter-section:nth-child(1) .input-group input:nth-child(3)').placeholder = (currentLanguage === 'np') ? 'दिन (Day)' : 'Day';
    document.getElementById('bs-to-ad-btn').textContent = (currentLanguage === 'np') ? 'Convert to AD' : 'Convert to AD';
    document.querySelector('#converter-container .converter-section:nth-child(2) h3').textContent = (currentLanguage === 'np') ? 'AD to BS Converter' : 'AD to BS Converter';
    document.querySelector('#converter-container .converter-section:nth-child(2) .input-group .input-label').textContent = (currentLanguage === 'np') ? 'AD मिति' : 'AD Date';
    document.getElementById('ad-to-bs-btn').textContent = (currentLanguage === 'np') ? 'Convert to BS' : 'Convert to BS';
  }

  function updateTimeLabels() {
    document.getElementById('time-zone').textContent = (currentLanguage === 'np') ? 'नेपाल समय' : 'Nepal Time';
  }

  function updateCalendarLabels() {
    const monthNamesNp = [
      "बैशाख", "जेठ", "असार", "श्रावण", "भदौ", "असोज",
      "कार्तिक", "मंसिर", "पुष", "माघ", "फाल्गुन", "चैत"
    ];
    const monthNamesEn = [
      "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Asoj",
      "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
    ];
    const dayHeadersNp = ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"];
    const dayHeadersEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const calendarHeader = document.querySelector('.calendar-header h3');
    if (calendarHeader) {
      const year = calendarHeader.textContent.split(' ')[1];
      const monthIndex = monthNamesNp.indexOf(calendarHeader.textContent.split(' ')[0]);
      if (currentLanguage === 'np') {
        calendarHeader.textContent = `${monthNamesNp[monthIndex]} ${nepaliNumber(year)}`;
      } else {
        calendarHeader.textContent = `${monthNamesEn[monthIndex]} ${year}`;
      }
    }

    const dayHeaders = document.querySelectorAll('.calendar-grid .day-header');
    dayHeaders.forEach((header, index) => {
      header.textContent = (currentLanguage === 'np') ? dayHeadersNp[index] : dayHeadersEn[index];
    });
  }

  // Calendar functionalityp'; // Default language

  function loadLanguagePreference() {
    chrome.storage.sync.get(['language'], function(result) {
      if (result.language) {
        currentLanguage = result.language;
      }
      updateLanguageDisplay();
    });
  }

  function toggleLanguage() {
    currentLanguage = (currentLanguage === 'np') ? 'en' : 'np';
    chrome.storage.sync.set({language: currentLanguage}, function() {
      updateLanguageDisplay();
      // Re-render elements that depend on language
      updateDateDisplay();
      updateConverterLabels();
      updateTimeLabels();
      updateCalendarLabels();
    });
  }

  function updateLanguageDisplay() {
    document.getElementById('language-toggle-btn').textContent = (currentLanguage === 'np') ? 'EN' : 'NP';
    // Update other UI elements based on language
    document.querySelector('.header h1').textContent = (currentLanguage === 'np') ? 'कति गते?' : 'Kati Gatey?';
    document.getElementById('calendar-btn').textContent = (currentLanguage === 'np') ? 'पात्रो हेर्नुहोस्' : 'View Calendar';
    document.getElementById('converter-btn').textContent = (currentLanguage === 'np') ? 'मिति रूपान्तरण' : 'Date Converter';
    document.getElementById('time-btn').textContent = (currentLanguage === 'np') ? 'समय देखाउनुहोस्' : 'Show Time';
    document.getElementById('close-converter-btn').textContent = (currentLanguage === 'np') ? 'बन्द गर्नुहोस्' : 'Close';
    document.getElementById('close-time-btn').textContent = (currentLanguage === 'np') ? 'बन्द गर्नुहोस्' : 'Close';
    document.getElementById('copy-date-btn').textContent = (currentLanguage === 'np') ? 'मिति कपी गर्नुहोस्' : 'Copy Date';
    document.getElementById('copy-time-btn').textContent = (currentLanguage === 'np') ? 'समय कपी गर्नुहोस्' : 'Copy Time';
    document.getElementById('close-calendar-btn').textContent = (currentLanguage === 'np') ? 'बन्द गर्नुहोस्' : 'Close';
  }

  function updateDateDisplay() {
    const nepaliDate = new NepaliDate();
    document.getElementById("nepali-date").textContent = nepaliDate.format("ddd, YYYY/MM/DD", "np");
    document.getElementById("english-date").textContent = nepaliDate.format("ddd, YYYY/MM/DD", "en");
  }

  function updateConverterLabels() {
    document.querySelector('#converter-container .converter-section:nth-child(1) h3').textContent = (currentLanguage === 'np') ? 'BS to AD Converter' : 'BS to AD Converter';
    document.querySelector('#converter-container .converter-section:nth-child(1) .input-group input:nth-child(1)').placeholder = (currentLanguage === 'np') ? 'वर्ष (Year)' : 'Year';
    document.querySelector('#converter-container .converter-section:nth-child(1) .input-group input:nth-child(2)').placeholder = (currentLanguage === 'np') ? 'महिना (Month)' : 'Month';
    document.querySelector('#converter-container .converter-section:nth-child(1) .input-group input:nth-child(3)').placeholder = (currentLanguage === 'np') ? 'दिन (Day)' : 'Day';
    document.getElementById('bs-to-ad-btn').textContent = (currentLanguage === 'np') ? 'Convert to AD' : 'Convert to AD';
    document.querySelector('#converter-container .converter-section:nth-child(2) h3').textContent = (currentLanguage === 'np') ? 'AD to BS Converter' : 'AD to BS Converter';
    document.querySelector('#converter-container .converter-section:nth-child(2) .input-group .input-label').textContent = (currentLanguage === 'np') ? 'AD मिति' : 'AD Date';
    document.getElementById('ad-to-bs-btn').textContent = (currentLanguage === 'np') ? 'Convert to BS' : 'Convert to BS';
  }

  function updateTimeLabels() {
    document.getElementById('time-zone').textContent = (currentLanguage === 'np') ? 'नेपाल समय' : 'Nepal Time';
  }

  function updateCalendarLabels() {
    const monthNamesNp = [
      "बैशाख", "जेठ", "असार", "श्रावण", "भदौ", "असोज",
      "कार्तिक", "मंसिर", "पुष", "माघ", "फाल्गुन", "चैत"
    ];
    const monthNamesEn = [
      "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Asoj",
      "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
    ];
    const dayHeadersNp = ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"];
    const dayHeadersEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const calendarHeader = document.querySelector('.calendar-header h3');
    if (calendarHeader) {
      const year = calendarHeader.textContent.split(' ')[1];
      const monthIndex = monthNamesNp.indexOf(calendarHeader.textContent.split(' ')[0]);
      if (currentLanguage === 'np') {
        calendarHeader.textContent = `${monthNamesNp[monthIndex]} ${nepaliNumber(year)}`;
      } else {
        calendarHeader.textContent = `${monthNamesEn[monthIndex]} ${year}`;
      }
    }

    const dayHeaders = document.querySelectorAll('.calendar-grid .day-header');
    dayHeaders.forEach((header, index) => {
      header.textContent = (currentLanguage === 'np') ? dayHeadersNp[index] : dayHeadersEn[index];
    });
  }

  // Calendar functionality functionality
  function showCalendar() {
    console.log("Show calendar clicked");
    hideAllContainers();
    const calendarContainer = document.getElementById("calendar-container");
    calendarContainer.classList.remove("hidden");
    renderCalendar();
  }

  function renderCalendar() {
    const calendarContainer = document.getElementById("calendar-container");

    try {
      // Generate calendar
      const calendar = new NepaliCalendar();
      const nepaliDate = new NepaliDate();
      const todayDate = nepaliDate.getDate();

      const calendarData = calendar.generateCalendar(currentYear, currentMonth);

      const monthNames = [
        "बैशाख", "जेठ", "असार", "श्रावण", "भदौ", "असोज",
        "कार्तिक", "मंसिर", "पुष", "माघ", "फाल्गुन", "चैत"
      ];
      const nepaliNumbers = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

      const nepaliNumber = (num) => {
        return num.toString().split("").map((digit) => nepaliNumbers[Number(digit)]).join("");
      };

      calendarContainer.innerHTML = `
        <div class="calendar-header">
          <button class="nav-btn" id="prev-month-btn">‹</button>
          <h3>${monthNames[currentMonth]} ${nepaliNumber(currentYear)}</h3>
          <button class="nav-btn" id="next-month-btn">›</button>
        </div>
        <div class="calendar-grid">
          <div class="day-header">आइत</div>
          <div class="day-header">सोम</div>
          <div class="day-header">मंगल</div>
          <div class="day-header">बुध</div>
          <div class="day-header">बिहि</div>
          <div class="day-header">शुक्र</div>
          <div class="day-header">शनि</div>
          ${generateCalendarCells(calendarData, todayDate)}
        </div>
        <button class="btn btn-secondary close-btn" id="close-calendar-btn">बन्द गर्नुहोस्</button>
      `;

      // Add event listeners after DOM is updated
      document.getElementById("prev-month-btn").addEventListener("click", previousMonth);
      document.getElementById("next-month-btn").addEventListener("click", nextMonth);
      document.getElementById("close-calendar-btn").addEventListener("click", hideCalendar);
    } catch (error) {
      console.error("Error generating calendar:", error);
      calendarContainer.innerHTML = "<p>Error loading calendar</p>";
    }
  }

  function generateCalendarCells(calendarData, todayDate) {
    let cells = "";
    const nepaliNumbers = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

    const nepaliNumber = (num) => {
      return num.toString().split("").map((digit) => nepaliNumbers[Number(digit)]).join("");
    };

    calendarData.forEach((week) => {
      week.forEach((day) => {
        if (day === null) {
          cells += '<div class="calendar-cell empty"></div>';
        } else {
          const isToday = day === todayDate && 
                         currentYear === new NepaliDate().getYear() && 
                         currentMonth === new NepaliDate().getMonth();
          cells += `<div class="calendar-cell ${isToday ? "today" : ""}">${nepaliNumber(day)}</div>`;
        }
      });
    });

    return cells;
  }

  function hideCalendar() {
    console.log("Hide calendar clicked");
    const calendarContainer = document.getElementById("calendar-container");
    calendarContainer.classList.add("hidden");
  }

  function previousMonth() {
    console.log("Previous month clicked");
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  }

  function nextMonth() {
    console.log("Next month clicked");
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  }

  // Date Converter functionality
  function showConverter() {
    console.log("Show converter clicked");
    hideAllContainers();
    const converterContainer = document.getElementById("converter-container");
    converterContainer.classList.remove("hidden");
    
    // Pre-fill with current date
    const nepaliDate = new NepaliDate();
    document.getElementById("bs-year").value = nepaliDate.getYear();
    document.getElementById("bs-month").value = nepaliDate.getMonth() + 1;
    document.getElementById("bs-day").value = nepaliDate.getDate();
    
    // Set today's AD date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    document.getElementById("ad-date").value = `${year}-${month}-${day}`;
  }

  function convertBStoAD() {
    try {
      const year = parseInt(document.getElementById("bs-year").value);
      const month = parseInt(document.getElementById("bs-month").value);
      const day = parseInt(document.getElementById("bs-day").value);

      if (!year || !month || !day) {
        document.getElementById("bs-to-ad-result").textContent = "कृपया सबै फिल्डहरू भर्नुहोस्";
        return;
      }

      const adDate = NepaliDate.BStoAD(year, month, day);
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      
      const formattedDate = adDate.toLocaleDateString('en-US', options);
      document.getElementById("bs-to-ad-result").textContent = `AD: ${formattedDate}`;
      
    } catch (error) {
      console.error("Error converting BS to AD:", error);
      document.getElementById("bs-to-ad-result").textContent = "अवैध मिति वा रूपान्तरण त्रुटि";
    }
  }

  function convertADtoBS() {
    try {
      const year = parseInt(document.getElementById("ad-year").value);
      const month = parseInt(document.getElementById("ad-month").value);
      const day = parseInt(document.getElementById("ad-day").value);

      if (!year || !month || !day) {
        document.getElementById("ad-to-bs-result").textContent = "कृपया सबै फिल्डहरू भर्नुहोस्";
        return;
      }

      const adDate = new Date(year, month - 1, day);
      const nepaliDate = new NepaliDate(adDate);
      
      const bsFormatted = nepaliDate.format("YYYY MMMM DD, ddd", "np");
      const bsEnglish = nepaliDate.format("YYYY/MM/DD", "en");
      
      document.getElementById("ad-to-bs-result").innerHTML = 
        `BS: ${bsFormatted}<br>BS (English): ${bsEnglish}`;
      
    } catch (error) {
      console.error("Error converting AD to BS:", error);
      document.getElementById("ad-to-bs-result").textContent = "अवैध मिति वा रूपान्तरण त्रुटि";
    }
  }

  function hideConverter() {
    console.log("Hide converter clicked");
    const converterContainer = document.getElementById("converter-container");
    converterContainer.classList.add("hidden");
    
    // Clear results
    document.getElementById("bs-to-ad-result").textContent = "";
    document.getElementById("ad-to-bs-result").textContent = "";
  }

  // Time functionality
  function showTime() {
    console.log("Show time clicked");
    hideAllContainers();
    const timeContainer = document.getElementById("time-container");
    timeContainer.classList.remove("hidden");
    updateTime();
  }

  function updateTime() {
    const now = new Date();
    
    // Nepal time (UTC+5:45)
    const nepalTime = new Date(now.getTime() + (5.75 * 60 * 60 * 1000));
    
    const timeString = nepalTime.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const timeElement = document.getElementById("current-time");
    if (timeElement) {
      timeElement.textContent = timeString;
    }
  }

  function copyDate() {
    try {
      const nepaliDate = new NepaliDate();
      const dateText = nepaliDate.format("YYYY/MM/DD", "np") + " (" + nepaliDate.format("YYYY/MM/DD", "en") + ")";
      
      navigator.clipboard.writeText(dateText).then(() => {
        showNotification("मिति कपी भयो!");
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = dateText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification("मिति कपी भयो!");
      });
    } catch (error) {
      console.error("Error copying date:", error);
      showNotification("कपी गर्न सकिएन");
    }
  }

  function copyTime() {
    try {
      const now = new Date();
      const nepalTime = new Date(now.getTime() + (5.75 * 60 * 60 * 1000));
      const timeString = nepalTime.toLocaleTimeString('en-US', { hour12: true });
      
      navigator.clipboard.writeText(timeString).then(() => {
        showNotification("समय कपी भयो!");
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = timeString;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification("समय कपी भयो!");
      });
    } catch (error) {
      console.error("Error copying time:", error);
      showNotification("कपी गर्न सकिएन");
    }
  }

  function hideTime() {
    console.log("Hide time clicked");
    const timeContainer = document.getElementById("time-container");
    timeContainer.classList.add("hidden");
  }

  // Utility functions
  function hideAllContainers() {
    document.getElementById("calendar-container").classList.add("hidden");
    document.getElementById("converter-container").classList.add("hidden");
    document.getElementById("time-container").classList.add("hidden");
  }

  function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #4CAF50;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 14px;
      z-index: 1000;
      animation: fadeInOut 2s ease-in-out;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-style')) {
      const style = document.createElement('style');
      style.id = 'notification-style';
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-20px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 2000);
  }
});

