// نظام تسجيل الدخول والمستخدمين
      const authModal = document.getElementById("auth-modal");
      const authToggle = document.getElementById("auth-toggle");
      const authClose = document.querySelector(".auth-close");
      const authTabs = document.querySelectorAll(".auth-tab");
      const authForms = document.querySelectorAll(".auth-form");
      const loginForm = document.getElementById("login-form");
      const registerForm = document.getElementById("register-form");
      const userMenu = document.querySelector(".user-menu");
      const userDashboard = document.getElementById("user-dashboard");
      const logoutBtn = document.getElementById("logout-btn");
      const userEmailDisplay = document.getElementById("user-email-display");
      const notificationsToggle = document.getElementById(
        "notifications-toggle"
      );
      const followedProjects = document.getElementById("followed-projects");
      const notificationToast = document.getElementById("notification-toast");
      const adminToggle = document.getElementById("admin-toggle");
      const adminModal = document.getElementById("admin-modal");
      const adminClose = document.querySelector(".admin-close");
      const addProjectBtn = document.getElementById("add-project-btn");
      const exportUsersBtn = document.getElementById("export-users-btn");
      const viewUsersBtn = document.getElementById("view-users-btn");
      const projectForm = document.getElementById("project-form");
      const saveProjectBtn = document.getElementById("save-project-btn");
      const cancelProjectBtn = document.getElementById("cancel-project-btn");
      const adminProjectsList = document.getElementById("admin-projects-list");
      const projectsContainer = document.getElementById("projects-container");
      const userStats = document.getElementById("user-stats");
      const usersManagement = document.getElementById("users-management");
      const usersList = document.getElementById("users-list");
      const totalUsers = document.getElementById("total-users");
      const newUsersToday = document.getElementById("new-users-today");
      const activeUsers = document.getElementById("active-users");
      const bannedUsers = document.getElementById("banned-users");

      // تعريف currentLang إذا لم تكن موجودة
      let currentLang = localStorage.getItem("language") || "ar";

      // بيانات المسؤول الثابتة
      const adminUser = {
        email: "admin@maazxp.com",
        password: "admin",
        name: "المسؤول",
        isAdmin: true,
        isBanned: false,
        registrationDate: new Date().toISOString(),
      };

      let currentUser = null;
      let users = JSON.parse(localStorage.getItem("users")) || [adminUser];
      let followedProjectsList =
        JSON.parse(localStorage.getItem("followedProjects")) || {};
      let projects = JSON.parse(localStorage.getItem("projects")) || [
        {
          id: "project-1",
          title: "مشروع قريبًا",
          titleEn: "Coming Soon",
          description:
            "أعمل حاليًا على مشاريع جديدة ومثيرة ستكون متاحة قريبًا. تابعني لترى أحدث إبداعاتي في عالم تطوير الألعاب.",
          descriptionEn:
            "I'm currently working on new and exciting projects that will be available soon. Follow me to see my latest creations in the world of game development.",
          colors: ["#667eea", "#764ba2"],
          icon: "🚀",
          link: "#contact",
        },
        {
          id: "project-2",
          title: "لعبة جديدة قريبًا",
          titleEn: "New Game Coming Soon",
          description:
            "لعبة جديدة قيد التطوير باستخدام محرك Godot، ستوفر تجربة لعب فريدة ومثيرة. ترقبوا الإطلاق!",
          descriptionEn:
            "A new game under development using Godot Engine, offering a unique and exciting gameplay experience. Stay tuned for the launch!",
          colors: ["#f093fb", "#f5576c"],
          icon: "🎮",
          link: "#contact",
        },
        {
          id: "project-3",
          title: "مشروع تعليمي قريبًا",
          titleEn: "Educational Project Coming Soon",
          description:
            "مشروع تعليمي يهدف إلى مساعدة المطورين المبتدئين في تعلم أساسيات تطوير الألعاب باستخدام Godot وGDScript.",
          descriptionEn:
            "An educational project aimed at helping beginner developers learn the basics of game development using Godot and GDScript.",
          colors: ["#4facfe", "#00f2fe"],
          icon: "📚",
          link: "#contact",
        },
      ];

      let editingProjectId = null;

      // فتح/إغلاق نافذة تسجيل الدخول
      authToggle.addEventListener("click", () => {
        if (currentUser) {
          // إذا كان المستخدم مسجل دخول، الانتقال إلى لوحة المستخدم
          window.location.href = "#user-dashboard";
          userDashboard.style.display = "block";
        } else {
          // إذا لم يكن مسجل دخول، فتح نافذة التسجيل
          authModal.style.display = "block";
        }
      });

      authClose.addEventListener("click", () => {
        authModal.style.display = "none";
      });

      // فتح/إغلاق نافذة الإدارة
      adminToggle.addEventListener("click", () => {
        adminModal.style.display = "block";
        loadAdminData();
      });

      adminClose.addEventListener("click", () => {
        adminModal.style.display = "none";
      });

      window.addEventListener("click", (e) => {
        if (e.target === authModal) {
          authModal.style.display = "none";
        }
        if (e.target === adminModal) {
          adminModal.style.display = "none";
        }
      });

      // تبديل بين تسجيل الدخول وإنشاء حساب
      authTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const tabName = tab.getAttribute("data-tab");

          // إزالة النشاط من جميع الألسنة والنماذج
          authTabs.forEach((t) => t.classList.remove("active"));
          authForms.forEach((f) => f.classList.remove("active"));

          // إضافة النشاط للسان والنموذج المحدد
          tab.classList.add("active");
          document.getElementById(`${tabName}-form`).classList.add("active");
        });
      });

      // تسجيل الدخول
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        // التحقق من صحة بيانات الدخول
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          // التحقق إذا كان المستخدم محظوراً
          if (user.isBanned) {
            alert(
              currentLang === "ar"
                ? "هذا الحساب محظور. يرجى التواصل مع الإدارة."
                : "This account is banned. Please contact administration."
            );
            return;
          }

          currentUser = user;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          updateUIAfterLogin();
          authModal.style.display = "none";
          showNotification(
            currentLang === "ar"
              ? "تم تسجيل الدخول بنجاح!"
              : "Login successful!"
          );
        } else {
          alert(
            currentLang === "ar"
              ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
              : "Invalid email or password"
          );
        }
      });

      // إنشاء حساب جديد
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById(
          "register-confirm-password"
        ).value;

        // التحقق من صحة البيانات
        if (password !== confirmPassword) {
          alert(
            currentLang === "ar"
              ? "كلمتا المرور غير متطابقتين"
              : "Passwords do not match"
          );
          return;
        }

        if (users.find((u) => u.email === email)) {
          alert(
            currentLang === "ar"
              ? "هذا البريد الإلكتروني مستخدم بالفعل"
              : "This email is already registered"
          );
          return;
        }

        // إنشاء حساب جديد
        const newUser = {
          name,
          email,
          password,
          isAdmin: false,
          isBanned: false,
          registrationDate: new Date().toISOString(),
        };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        currentUser = newUser;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        updateUIAfterLogin();
        authModal.style.display = "none";
        showNotification(
          currentLang === "ar"
            ? "تم إنشاء الحساب بنجاح!"
            : "Account created successfully!"
        );
      });

      // تسجيل الخروج
      logoutBtn.addEventListener("click", () => {
        currentUser = null;
        localStorage.removeItem("currentUser");
        updateUIAfterLogout();
        showNotification(
          currentLang === "ar" ? "تم تسجيل الخروج" : "Logged out successfully"
        );
        window.location.href = "#home";
      });

      // تحديث واجهة المستخدم بعد تسجيل الدخول
      function updateUIAfterLogin() {
        userMenu.style.display = "block";
        authToggle.innerHTML = '<i class="fas fa-user-check"></i>';
        authToggle.title = currentLang === "ar" ? "حسابي" : "My Account";

        // إظهار زر الإدارة إذا كان المستخدم مسؤولاً
        if (currentUser.isAdmin) {
          adminToggle.style.display = "block";
        }

        // تحديث لوحة المستخدم
        userEmailDisplay.textContent = currentUser.email;

        // تحميل المشاريع المتابعة
        loadFollowedProjects();

        // تحميل تفضيلات الإشعارات
        const notificationPref = localStorage.getItem(
          `notifications_${currentUser.email}`
        );
        notificationsToggle.checked = notificationPref === "true";
      }

      // تحديث واجهة المستخدم بعد تسجيل الخروج
      function updateUIAfterLogout() {
        userMenu.style.display = "none";
        userDashboard.style.display = "none";
        adminToggle.style.display = "none";
        authToggle.innerHTML = '<i class="fas fa-user"></i>';
        authToggle.title = currentLang === "ar" ? "تسجيل الدخول" : "Login";
      }

      // تحميل المشاريع المتابعة
      function loadFollowedProjects() {
        const userFollowed = followedProjectsList[currentUser.email] || [];
        followedProjects.innerHTML = "";

        if (userFollowed.length === 0) {
          followedProjects.innerHTML = `<p data-ar="لم تتابع أي مشاريع بعد" data-en="You haven't followed any projects yet">لم تتابع أي مشاريع بعد</p>`;
        } else {
          userFollowed.forEach((project) => {
            const projectElement = document.createElement("div");
            projectElement.className = "followed-project-item";
            projectElement.innerHTML = `
              <h4>${project.title}</h4>
              <p>${project.description}</p>
              <button class="btn btn-outline unfollow-btn" data-project="${
                project.id
              }">
                ${currentLang === "ar" ? "إلغاء المتابعة" : "Unfollow"}
              </button>
            `;
            followedProjects.appendChild(projectElement);
          });

          // إضافة مستمعي الأحداث لأزرار إلغاء المتابعة
          document.querySelectorAll(".unfollow-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
              const projectId = e.target.getAttribute("data-project");
              unfollowProject(projectId);
            });
          });
        }
      }

      // إلغاء متابعة مشروع
      function unfollowProject(projectId) {
        if (!currentUser) return;

        const userFollowed = followedProjectsList[currentUser.email] || [];
        const updatedFollowed = userFollowed.filter((p) => p.id !== projectId);
        followedProjectsList[currentUser.email] = updatedFollowed;
        localStorage.setItem(
          "followedProjects",
          JSON.stringify(followedProjectsList)
        );

        loadFollowedProjects();
        showNotification(
          currentLang === "ar"
            ? "تم إلغاء متابعة المشروع"
            : "Project unfollowed"
        );
      }

      // عرض الإشعارات
      function showNotification(message) {
        notificationToast.textContent = message;
        notificationToast.classList.add("show");

        setTimeout(() => {
          notificationToast.classList.remove("show");
        }, 3000);
      }

      // تحديث تفضيلات الإشعارات
      notificationsToggle.addEventListener("change", () => {
        if (currentUser) {
          localStorage.setItem(
            `notifications_${currentUser.email}`,
            notificationsToggle.checked
          );
          showNotification(
            currentLang === "ar"
              ? `تم ${
                  notificationsToggle.checked ? "تفعيل" : "تعطيل"
                } الإشعارات`
              : `Notifications ${
                  notificationsToggle.checked ? "enabled" : "disabled"
                }`
          );
        }
      });

      // تحميل بيانات المستخدم عند بدء التشغيل
      function loadUserData() {
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
          currentUser = JSON.parse(savedUser);
          updateUIAfterLogin();
        }
      }

      // تحميل المشاريع وعرضها
      function loadProjects() {
        projectsContainer.innerHTML = "";

        projects.forEach((project) => {
          const projectElement = document.createElement("div");
          projectElement.className = "project-card fade-in";
          projectElement.innerHTML = `
            <div class="project-img" style="background: linear-gradient(135deg, ${
              project.colors[0]
            } 0%, ${project.colors[1]} 100%);">
              <span>${project.icon}</span>
            </div>
            <div class="project-content">
              <h3 data-ar="${project.title}" data-en="${project.titleEn}">${
            project.title
          }</h3>
              <p data-ar="${project.description}" data-en="${
            project.descriptionEn
          }">${project.description}</p>
              <div class="project-actions">
                <button class="btn follow-btn" data-project="${
                  project.id
                }" data-ar="متابعة المشروع" data-en="Follow Project">
                  ${currentLang === "ar" ? "متابعة المشروع" : "Follow Project"}
                </button>
                ${
                  project.link
                    ? `<a href="${
                        project.link
                      }" class="btn btn-outline" data-ar="المزيد" data-en="More">${
                        currentLang === "ar" ? "المزيد" : "More"
                      }</a>`
                    : ""
                }
              </div>
            </div>
          `;
          projectsContainer.appendChild(projectElement);
        });

        // إضافة مستمعي الأحداث لأزرار المتابعة
        document.querySelectorAll(".follow-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            if (!currentUser) {
              showNotification(
                currentLang === "ar"
                  ? "يجب تسجيل الدخول أولاً"
                  : "Please login first"
              );
              authModal.style.display = "block";
              return;
            }

            const projectId = e.target.getAttribute("data-project");
            const project = projects.find((p) => p.id === projectId);

            if (project) {
              followProject(projectId, project.title, project.description);
            }
          });
        });

        // إضافة تأثيرات التمرير
        const projectCards = document.querySelectorAll(".project-card");
        const projectObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry, index) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  entry.target.classList.add("visible");
                }, index * 150);
              }
            });
          },
          { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        projectCards.forEach((card) => {
          projectObserver.observe(card);
        });
      }

      // متابعة مشروع
      function followProject(projectId, title, description) {
        if (!currentUser) return;

        const userFollowed = followedProjectsList[currentUser.email] || [];

        // التحقق إذا كان المستخدم يتابع المشروع بالفعل
        if (userFollowed.find((p) => p.id === projectId)) {
          showNotification(
            currentLang === "ar"
              ? "أنت تتابع هذا المشروع بالفعل"
              : "You are already following this project"
          );
          return;
        }

        // إضافة المشروع إلى قائمة المتابعة
        userFollowed.push({
          id: projectId,
          title: title,
          description: description,
        });

        followedProjectsList[currentUser.email] = userFollowed;
        localStorage.setItem(
          "followedProjects",
          JSON.stringify(followedProjectsList)
        );

        loadFollowedProjects();
        showNotification(
          currentLang === "ar"
            ? "تمت متابعة المشروع بنجاح"
            : "Project followed successfully"
        );
      }

      // تحميل بيانات الإدارة
      function loadAdminData() {
        loadAdminProjects();
        loadUserStats();
      }

      // تحميل المشاريع في لوحة الإدارة
      function loadAdminProjects() {
        adminProjectsList.innerHTML = "";

        projects.forEach((project) => {
          const projectElement = document.createElement("div");
          projectElement.className = "admin-project-item";
          projectElement.innerHTML = `
            <div>
              <h4>${project.title}</h4>
              <p>${project.description}</p>
            </div>
            <div>
              <button class="btn admin-btn edit-project-btn" data-project="${
                project.id
              }" data-ar="تعديل" data-en="Edit">${
            currentLang === "ar" ? "تعديل" : "Edit"
          }</button>
              <button class="btn btn-outline delete-project-btn" data-project="${
                project.id
              }" data-ar="حذف" data-en="Delete">${
            currentLang === "ar" ? "حذف" : "Delete"
          }</button>
            </div>
          `;
          adminProjectsList.appendChild(projectElement);
        });

        // إضافة مستمعي الأحداث لأزرار التعديل والحذف
        document.querySelectorAll(".edit-project-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const projectId = e.target.getAttribute("data-project");
            editProject(projectId);
          });
        });

        document.querySelectorAll(".delete-project-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const projectId = e.target.getAttribute("data-project");
            deleteProject(projectId);
          });
        });
      }

      // تحميل إحصائيات المستخدمين
      function loadUserStats() {
        const today = new Date().toDateString();
        const todayUsers = users.filter((user) => {
          const userDate = new Date(user.registrationDate).toDateString();
          return userDate === today && !user.isAdmin;
        });

        const bannedUsersCount = users.filter(
          (user) => user.isBanned && !user.isAdmin
        ).length;

        totalUsers.textContent = users.filter((u) => !u.isAdmin).length;
        newUsersToday.textContent = todayUsers.length;
        activeUsers.textContent = Object.keys(followedProjectsList).length;
        bannedUsers.textContent = bannedUsersCount;
      }

      // عرض قائمة المستخدمين
      viewUsersBtn.addEventListener("click", () => {
        usersManagement.style.display =
          usersManagement.style.display === "none" ? "block" : "none";
        userStats.style.display =
          userStats.style.display === "none" ? "block" : "none";

        if (usersManagement.style.display === "block") {
          loadUsersList();
        }
      });

      // تحميل قائمة المستخدمين
      function loadUsersList() {
        usersList.innerHTML = "";

        const regularUsers = users.filter((user) => !user.isAdmin);

        if (regularUsers.length === 0) {
          usersList.innerHTML = `<p data-ar="لا يوجد مستخدمين مسجلين بعد" data-en="No registered users yet">لا يوجد مستخدمين مسجلين بعد</p>`;
          return;
        }

        regularUsers.forEach((user) => {
          const userElement = document.createElement("div");
          userElement.className = `admin-user-item ${
            user.isBanned ? "user-banned" : ""
          }`;
          const registrationDate = new Date(
            user.registrationDate
          ).toLocaleDateString("ar-EG");
          const registrationDateEn = new Date(
            user.registrationDate
          ).toLocaleDateString("en-US");

          userElement.innerHTML = `
            <div>
              ${
                user.isBanned
                  ? '<span class="banned-badge" data-ar="محظور" data-en="Banned">محظور</span>'
                  : ""
              }
              <h4>${user.name}</h4>
              <p>${user.email}</p>
              <small data-ar="تاريخ التسجيل: ${registrationDate}" data-en="Registration Date: ${registrationDateEn}">
                ${
                  currentLang === "ar"
                    ? `تاريخ التسجيل: ${registrationDate}`
                    : `Registration Date: ${registrationDateEn}`
                }
              </small>
            </div>
            <div>
              <button class="btn ${
                user.isBanned ? "unban-btn" : "ban-btn"
              }" data-user="${user.email}">
                ${
                  user.isBanned
                    ? currentLang === "ar"
                      ? "فك الحظر"
                      : "Unban"
                    : currentLang === "ar"
                    ? "حظر"
                    : "Ban"
                }
              </button>
            </div>
          `;
          usersList.appendChild(userElement);
        });

        // إضافة مستمعي الأحداث لأزرار الحظر/فك الحظر
        document.querySelectorAll(".ban-btn, .unban-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const userEmail = e.target.getAttribute("data-user");
            toggleUserBan(userEmail);
          });
        });
      }

      // حظر/فك حظر مستخدم
      function toggleUserBan(userEmail) {
        const userIndex = users.findIndex((u) => u.email === userEmail);
        if (userIndex === -1) return;

        const user = users[userIndex];
        user.isBanned = !user.isBanned;

        // إذا تم حظر المستخدم، قم بتسجيل خروجه إذا كان مسجل دخول
        if (user.isBanned && currentUser && currentUser.email === userEmail) {
          currentUser = null;
          localStorage.removeItem("currentUser");
          updateUIAfterLogout();
          showNotification(
            currentLang === "ar"
              ? "تم حظر حسابك"
              : "Your account has been banned"
          );
        }

        users[userIndex] = user;
        localStorage.setItem("users", JSON.stringify(users));

        loadUsersList();
        loadUserStats();

        showNotification(
          currentLang === "ar"
            ? user.isBanned
              ? "تم حظر المستخدم"
              : "تم فك حظر المستخدم"
            : user.isBanned
            ? "User banned"
            : "User unbanned"
        );
      }

      // تصدير بيانات المستخدمين
      exportUsersBtn.addEventListener("click", () => {
        const regularUsers = users.filter((user) => !user.isAdmin);
        const usersData = JSON.stringify(regularUsers, null, 2);
        const blob = new Blob([usersData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "maazxp_users.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification(
          currentLang === "ar"
            ? "تم تصدير بيانات المستخدمين"
            : "Users data exported successfully"
        );
      });

      // إضافة مشروع جديد
      addProjectBtn.addEventListener("click", () => {
        editingProjectId = null;
        projectForm.style.display = "block";
        document.getElementById("project-form-title").textContent =
          currentLang === "ar" ? "إضافة مشروع جديد" : "Add New Project";
        document.getElementById("project-title").value = "";
        document.getElementById("project-description").value = "";
        document.getElementById("project-color1").value = "#667eea";
        document.getElementById("project-color2").value = "#764ba2";
        document.getElementById("project-icon").value = "🚀";
        document.getElementById("project-link").value = "";

        // تحديث معاينات الألوان
        updateColorPreviews();
      });

      // تحديث معاينات الألوان
      function updateColorPreviews() {
        const color1 = document.getElementById("project-color1").value;
        const color2 = document.getElementById("project-color2").value;
        document.getElementById("color-preview1").style.background = color1;
        document.getElementById("color-preview2").style.background = color2;
      }

      // إضافة مستمعي الأحداث لتحديث معاينات الألوان
      document
        .getElementById("project-color1")
        .addEventListener("input", updateColorPreviews);
      document
        .getElementById("project-color2")
        .addEventListener("input", updateColorPreviews);

      // تعديل مشروع
      function editProject(projectId) {
        const project = projects.find((p) => p.id === projectId);
        if (!project) return;

        editingProjectId = projectId;
        projectForm.style.display = "block";
        document.getElementById("project-form-title").textContent =
          currentLang === "ar" ? "تعديل المشروع" : "Edit Project";
        document.getElementById("project-title").value = project.title;
        document.getElementById("project-description").value =
          project.description;
        document.getElementById("project-color1").value = project.colors[0];
        document.getElementById("project-color2").value = project.colors[1];
        document.getElementById("project-icon").value = project.icon;
        document.getElementById("project-link").value = project.link || "";

        // تحديث معاينات الألوان
        updateColorPreviews();
      }

      // حفظ المشروع
      saveProjectBtn.addEventListener("click", () => {
        const title = document.getElementById("project-title").value;
        const description = document.getElementById(
          "project-description"
        ).value;
        const color1 = document.getElementById("project-color1").value;
        const color2 = document.getElementById("project-color2").value;
        const icon = document.getElementById("project-icon").value;
        const link = document.getElementById("project-link").value;

        if (!title || !description) {
          alert(
            currentLang === "ar"
              ? "يرجى ملء جميع الحقول المطلوبة"
              : "Please fill all required fields"
          );
          return;
        }

        if (editingProjectId) {
          // تحديث المشروع الموجود
          const projectIndex = projects.findIndex(
            (p) => p.id === editingProjectId
          );
          if (projectIndex !== -1) {
            projects[projectIndex] = {
              ...projects[projectIndex],
              title: title,
              description: description,
              colors: [color1, color2],
              icon: icon,
              link: link,
            };
          }
        } else {
          // إضافة مشروع جديد
          const newProject = {
            id: "project-" + Date.now(),
            title: title,
            titleEn: title,
            description: description,
            descriptionEn: description,
            colors: [color1, color2],
            icon: icon,
            link: link,
          };
          projects.push(newProject);
        }

        // حفظ المشاريع في localStorage
        localStorage.setItem("projects", JSON.stringify(projects));

        // إعادة تحميل المشاريع
        loadProjects();
        loadAdminProjects();

        // إخفاء النموذج
        projectForm.style.display = "none";

        showNotification(
          currentLang === "ar"
            ? editingProjectId
              ? "تم تحديث المشروع"
              : "تم إضافة المشروع"
            : editingProjectId
            ? "Project updated"
            : "Project added"
        );
      });

      // إلغاء حفظ المشروع
      cancelProjectBtn.addEventListener("click", () => {
        projectForm.style.display = "none";
      });

      // حذف مشروع
      function deleteProject(projectId) {
        if (
          confirm(
            currentLang === "ar"
              ? "هل أنت متأكد من حذف هذا المشروع؟"
              : "Are you sure you want to delete this project?"
          )
        ) {
          projects = projects.filter((p) => p.id !== projectId);
          localStorage.setItem("projects", JSON.stringify(projects));
          loadProjects();
          loadAdminProjects();
          showNotification(
            currentLang === "ar" ? "تم حذف المشروع" : "Project deleted"
          );
        }
      }

      // نظام تعدد اللغات الموجود
      const langToggle = document.getElementById("lang-toggle");

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
            ? "Moaz | Maazxp - مبرمج وصانع ألعاب باستخدام محرك Godot"
            : "Moaz | Maazxp - Game Developer & Programmer using Godot Engine";
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

      // نموذج التواصل
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
        loadUserData();
        loadProjects();
      });

      // تأثيرات إضافية للشريط العلوي عند التمرير
      window.addEventListener("scroll", () => {
        const header = document.querySelector("header");
        if (window.scrollY > 100) {
          header.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
          header.style.padding = "10px 0";
        } else {
          header.style.boxShadow = "var(--shadow)";
          header.style.padding = "15px 0";
        }
      });