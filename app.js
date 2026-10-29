const STORAGE_KEY = "survey-demo-responses-v1";

const QUESTIONS = [
  {
    id: "role",
    type: "single",
    title: "您的角色是？",
    options: ["医药市场 / Marketing", "医学事务 / Medical", "销售代表", "数字化 / IT", "其他"],
  },
  {
    id: "channel",
    type: "single",
    title: "日常最常用的 HCP 触达渠道？",
    options: ["微信 / 企微", "线下拜访", "学术会议", "邮件", "多渠道组合"],
  },
  {
    id: "pain",
    type: "multi",
    title: "当前最大的挑战是？（可多选）",
    options: ["内容合规与版本管理", "精准圈选医生", "互动数据难追踪", "微信自动化触达", "跨团队协作"],
  },
  {
    id: "priority",
    type: "single",
    title: "若做一个演示系统，您最想先看哪块？",
    options: ["标签与 Journey", "内容管理", "微信 Marketing Automation", "互动行为追踪", "问卷与会议执行"],
  },
  {
    id: "comment",
    type: "text",
    title: "还有什么希望演示里包含的？",
    placeholder: "可选填写，例如：希望有中英切换、会议签到示意…",
  },
];

const state = {
  answers: {},
  step: 0,
};

function $(sel) {
  return document.querySelector(sel);
}

function getRoute() {
  const hash = location.hash.replace(/^#/, "") || "/";
  return hash.startsWith("/") ? hash : `/${hash}`;
}

function loadResponses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveResponse(payload) {
  const list = loadResponses();
  list.unshift(payload);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
}

function setActiveNav() {
  const route = getRoute();
  document.querySelectorAll(".nav-link").forEach((el) => {
    el.classList.toggle("active", el.dataset.route === route);
  });
}

function renderHome() {
  return `
    <section class="card hero">
      <h1>问卷系统演示<br/>3 分钟走完填写 → 提交 → 汇总</h1>
      <p>
        这是一个<strong>纯前端</strong>小原型，用来练习部署到 Vercel。
        提交结果保存在你浏览器本地，刷新汇总页即可看到统计。无需后端、无需数据库。
      </p>
      <div class="actions">
        <a class="btn btn-primary" href="#/survey">开始填写</a>
        <a class="btn btn-secondary" href="#/results">查看结果汇总</a>
      </div>
      <div class="steps">
        <div class="step"><strong>1. 本地打开</strong><span>双击 index.html 或用本地服务器预览</span></div>
        <div class="step"><strong>2. 推到 GitHub</strong><span>把 survey-demo 文件夹做成仓库</span></div>
        <div class="step"><strong>3. Vercel 部署</strong><span>导入仓库，一键得到可分享链接</span></div>
      </div>
    </section>
  `;
}

function isAnswered(q) {
  const v = state.answers[q.id];
  if (q.type === "multi") return Array.isArray(v) && v.length > 0;
  if (q.type === "text") return true;
  return typeof v === "string" && v.length > 0;
}

function renderSurvey() {
  if (state.step >= QUESTIONS.length) {
    const snapshot = {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      answers: { ...state.answers },
    };
    saveResponse(snapshot);
    state.step = 0;
    state.answers = {};
    return `
      <section class="card done">
        <h2>提交成功</h2>
        <p>感谢填写。本条答卷已写入浏览器本地存储，可到「结果汇总」查看统计。</p>
        <div class="summary">
          ${QUESTIONS.map((q) => {
            const val = snapshot.answers[q.id];
            const text = Array.isArray(val) ? val.join("、") : val || "（未填）";
            return `<div class="summary-item"><small>${q.title}</small><div>${escapeHtml(text)}</div></div>`;
          }).join("")}
        </div>
        <div class="nav-row">
          <a class="btn btn-secondary" href="#/results">查看汇总</a>
          <button class="btn btn-primary" type="button" id="again-btn">再填一份</button>
        </div>
      </section>
    `;
  }

  const q = QUESTIONS[state.step];
  const progress = Math.round((state.step / QUESTIONS.length) * 100);
  const current = state.answers[q.id];

  let body = "";
  if (q.type === "single") {
    body = `<div class="options">${q.options
      .map((opt) => {
        const selected = current === opt ? "selected" : "";
        return `<label class="option ${selected}"><input type="radio" name="${q.id}" value="${escapeAttr(opt)}" ${
          current === opt ? "checked" : ""
        }/><span>${escapeHtml(opt)}</span></label>`;
      })
      .join("")}</div>`;
  } else if (q.type === "multi") {
    const selectedSet = new Set(Array.isArray(current) ? current : []);
    body = `<div class="options">${q.options
      .map((opt) => {
        const selected = selectedSet.has(opt) ? "selected" : "";
        return `<label class="option ${selected}"><input type="checkbox" name="${q.id}" value="${escapeAttr(opt)}" ${
          selectedSet.has(opt) ? "checked" : ""
        }/><span>${escapeHtml(opt)}</span></label>`;
      })
      .join("")}</div>`;
  } else {
    body = `<textarea class="textarea" id="text-input" placeholder="${escapeAttr(
      q.placeholder || ""
    )}">${escapeHtml(current || "")}</textarea>`;
  }

  return `
    <section class="card">
      <div class="meta"><span>问题 ${state.step + 1} / ${QUESTIONS.length}</span><span>${progress}%</span></div>
      <div class="progress"><i style="width:${progress}%"></i></div>
      <h2 class="q-title">${escapeHtml(q.title)}</h2>
      ${body}
      <div class="nav-row">
        <button class="btn btn-ghost" type="button" id="prev-btn" ${state.step === 0 ? "disabled" : ""}>上一题</button>
        <button class="btn btn-primary" type="button" id="next-btn">${
          state.step === QUESTIONS.length - 1 ? "提交" : "下一题"
        }</button>
      </div>
    </section>
  `;
}

function renderResults() {
  const list = loadResponses();
  if (!list.length) {
    return `
      <section class="card">
        <h2>结果汇总</h2>
        <p class="empty">还没有答卷。先去填写一份问卷吧。</p>
        <a class="btn btn-primary" href="#/survey">去填写</a>
      </section>
    `;
  }

  const counts = {};
  QUESTIONS.filter((q) => q.type !== "text").forEach((q) => {
    counts[q.id] = {};
    q.options.forEach((opt) => {
      counts[q.id][opt] = 0;
    });
  });

  list.forEach((item) => {
    QUESTIONS.forEach((q) => {
      if (q.type === "text") return;
      const val = item.answers[q.id];
      const values = Array.isArray(val) ? val : [val];
      values.forEach((v) => {
        if (v && counts[q.id][v] !== undefined) counts[q.id][v] += 1;
      });
    });
  });

  const blocks = QUESTIONS.filter((q) => q.type !== "text")
    .map((q) => {
      const total = list.length;
      const rows = q.options
        .map((opt) => {
          const n = counts[q.id][opt];
          const pct = total ? Math.round((n / total) * 100) : 0;
          return `<div class="bar-row"><span>${escapeHtml(opt)}</span><div class="bar"><i style="width:${pct}%"></i></div><span>${n}</span></div>`;
        })
        .join("");
      return `<div class="stat"><h3>${escapeHtml(q.title)}</h3>${rows}</div>`;
    })
    .join("");

  return `
    <section class="card">
      <div class="meta"><h2 style="margin:0">结果汇总</h2><span>共 ${list.length} 份答卷</span></div>
      <p style="color:var(--muted);margin:0 0 16px">统计来自本机浏览器 localStorage，换设备/清缓存会变化。部署到 Vercel 后每位访客各自独立。</p>
      <div class="stats">${blocks}</div>
      <div class="nav-row">
        <button class="btn btn-ghost" type="button" id="clear-btn">清空本机答卷</button>
        <a class="btn btn-primary" href="#/survey">继续填写</a>
      </div>
    </section>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("'", "&#39;");
}

function bindSurveyEvents() {
  const q = QUESTIONS[state.step];
  if (!q) {
    $("#again-btn")?.addEventListener("click", () => {
      state.step = 0;
      state.answers = {};
      location.hash = "#/survey";
      render();
    });
    return;
  }

  if (q.type === "single" || q.type === "multi") {
    document.querySelectorAll(".option input").forEach((input) => {
      input.addEventListener("change", () => {
        if (q.type === "single") {
          state.answers[q.id] = input.value;
        } else {
          const checked = [...document.querySelectorAll(`input[name="${q.id}"]:checked`)].map((el) => el.value);
          state.answers[q.id] = checked;
        }
        render();
      });
    });
  }

  if (q.type === "text") {
    $("#text-input")?.addEventListener("input", (e) => {
      state.answers[q.id] = e.target.value;
    });
  }

  $("#prev-btn")?.addEventListener("click", () => {
    state.step = Math.max(0, state.step - 1);
    render();
  });

  $("#next-btn")?.addEventListener("click", () => {
    if (q.type === "text") {
      state.answers[q.id] = $("#text-input")?.value || "";
    }
    if (q.type !== "text" && !isAnswered(q)) {
      alert("请先选择一个选项");
      return;
    }
    state.step += 1;
    render();
  });
}

function bindResultsEvents() {
  $("#clear-btn")?.addEventListener("click", () => {
    if (confirm("确定清空本机保存的全部答卷？")) {
      localStorage.removeItem(STORAGE_KEY);
      render();
    }
  });
}

function render() {
  setActiveNav();
  const route = getRoute();
  const app = $("#app");

  if (route === "/survey") {
    app.innerHTML = renderSurvey();
    bindSurveyEvents();
    return;
  }
  if (route === "/results") {
    app.innerHTML = renderResults();
    bindResultsEvents();
    return;
  }
  app.innerHTML = renderHome();
}

window.addEventListener("hashchange", render);
render();
