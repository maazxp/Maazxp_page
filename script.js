// نظام تعدد اللغات
const langToggle = document.getElementById("lang-toggle");
let currentLang = "ar"; // اللغة الأساسية هي العربية

function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  updateLanguage();
  localStorage.setItem("language", currentLang);
}

function updateLanguage() {
  // تبديل اتجاه الصفحة
  document.body.classList.toggle("english", currentLang === "en");

  // تحديث جميع النصوص
  document.querySelectorAll("[data-ar], [data-en]").forEach((element) => {
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      const placeholder =
        currentLang === "ar"
          ? element.getAttribute("data-ar-placeholder")
          : element.getAttribute("data-en-placeholder");
      if (placeholder) element.placeholder = placeholder;
    } else {
      const text =
        currentLang === "ar"
          ? element.getAttribute("data-ar")
          : element.getAttribute("data-en");
      if (text) element.textContent = text;
    }
  });

  // تحديث عنوان الصفحة
  document.title =
    currentLang === "ar"
      ? "Moaz | Maazxp - مبرمج وصانع ألعاب"
      : "Moaz | Maazxp - Game Developer";
}

// نظام الوضع الليلي
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");

function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
    localStorage.setItem("theme", "dark");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
    localStorage.setItem("theme", "light");
  }
}

// القائمة المتحركة للهواتف
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

function toggleMenu() {
  navLinks.classList.toggle("active");
  menuToggle.querySelector("i").classList.toggle("fa-bars");
  menuToggle.querySelector("i").classList.toggle("fa-times");
}

// استعادة التفضيلات المحفوظة
function loadPreferences() {
  // تحميل اللغة
  const savedLang = localStorage.getItem("language");
  if (savedLang) {
    currentLang = savedLang;
    updateLanguage();
  }

  // تحميل السمة
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }

  // تحميل تفضيلات النظام
  if (
    !savedTheme &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.body.classList.add("dark-mode");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }
}

// إضافة event listeners
langToggle.addEventListener("click", toggleLanguage);
themeToggle.addEventListener("click", toggleTheme);
menuToggle.addEventListener("click", toggleMenu);

// إغلاق القائمة عند النقر على رابط
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuToggle.querySelector("i").classList.add("fa-bars");
    menuToggle.querySelector("i").classList.remove("fa-times");
  });
});

// تأثيرات التمرير
const fadeElements = document.querySelectorAll(".fade-in");
const skillCards = document.querySelectorAll(".skill-card");

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

fadeElements.forEach((element) => {
  observer.observe(element);
});

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, index * 150);
    }
  });
}, observerOptions);

skillCards.forEach((card) => {
  skillObserver.observe(card);
});

// تأثيرات أشرطة التقدم
const progressBars = document.querySelectorAll(".skill-progress-bar");
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // إضافة عرض الشريط بعد تأخير بسيط
      setTimeout(() => {
        entry.target.style.width = entry.target.classList.contains(
          "skill-progress-professional"
        )
          ? "90%"
          : entry.target.classList.contains("skill-progress-intermediate")
          ? "70%"
          : "40%";
      }, 300);
    }
  });
}, observerOptions);

progressBars.forEach((bar) => {
  progressObserver.observe(bar);
});

// نموذج التواصل - تم التحديث لاستخدام البريد الإلكتروني moaz38182@gmail.com
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> ' +
    (currentLang === "ar" ? "جاري الإرسال..." : "Sending...");
  submitBtn.disabled = true;

  // تنفيذ الإرسال بعد تأخير بسيط
  setTimeout(() => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const subject = currentLang === "ar" ? "رسالة من " : "Message from ";
    const body =
      currentLang === "ar"
        ? `${message}\n\nالرد على: ${email}`
        : `${message}\n\nReply to: ${email}`;

    // استخدام البريد الإلكتروني المحدث moaz38182@gmail.com
    const mailtoLink = `mailto:moaz38182@gmail.com?subject=${subject}${name}&body=${encodeURIComponent(
      body
    )}`;
    window.location.href = mailtoLink;

    contactForm.reset();

    // إعادة تعيين الزر
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    const alertMsg =
      currentLang === "ar"
        ? "شكراً لتواصلك! سيتم فتح تطبيق البريد الإلكتروني."
        : "Thank you for your message! Your email client will open.";
    alert(alertMsg);
  }, 1000);
});

// تحميل التفضيلات عند بدء التشغيل
window.addEventListener("load", () => {
  document.body.style.opacity = 1;
  loadPreferences();
});

// تأثيرات إضافية للشريط العلوي عند التمرير
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
    header.style.padding = "10px 0";
  } else {
    header.style.boxShadow = "var(--shadow)";
    header.style.padding = "20px 0";
  }
});
