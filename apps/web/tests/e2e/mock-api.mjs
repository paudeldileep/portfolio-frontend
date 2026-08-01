import { createServer } from "node:http";

const port = Number(process.env.MOCK_API_PORT ?? 3200);

const portfolioContent = {
  profile: {
    title: "Senior Frontend Engineer",
    summary: [
      "Frontend engineer focused on accessible interfaces and durable architecture.",
      "Experienced with modern web platforms, testing, and micro-frontends.",
    ],
  },
  skills: {
    frontend_engineering: ["React", "Next.js", "TypeScript"],
    frontend_architecture_accessibility: ["Micro-frontends", "WCAG"],
    performance_dev_experience: ["Core Web Vitals", "Turborepo"],
    backend_apis: ["Node.js", "FastAPI"],
    cloud_devops: ["Vercel", "Docker"],
    testing_quality: ["Vitest", "Playwright"],
    databases: ["PostgreSQL"],
    security: ["OWASP"],
    ai_emerging_tech: ["RAG"],
  },
  experience: [
    {
      company: "Fidelity Investments",
      role: "Senior Frontend Engineer",
      location: "United States",
      start_date: "2022",
      end_date: "Present",
      type: "experience",
      summary: "Built accessible, resilient frontend platforms.",
      highlights: ["Led frontend architecture and quality automation."],
    },
    {
      company: "Bank of America",
      role: "Frontend Engineer",
      location: "United States",
      start_date: "2019",
      end_date: "2022",
      type: "experience",
      summary: "Delivered large-scale customer-facing web experiences.",
      highlights: ["Improved component reuse and accessibility."],
    },
  ],
  education: [
    {
      degree: "Engineering",
      institution: "University",
      cgpa: "Distinction",
      type: "education",
    },
  ],
  certifications: [
    {
      name: "Frontend Engineering",
      issuer: "Professional Development",
      type: "certification",
    },
  ],
};

const publishedBlogPost = {
  slug: "building-an-accessible-content-pipeline",
  title: "Building an accessible content pipeline",
  description:
    "A small, typed publishing foundation that catches content mistakes before readers encounter them.",
  tags: ["Accessibility", "Architecture"],
  featured: true,
  image_path: null,
  published_at: "2026-07-30T12:00:00+00:00",
  author_name: "Dileep T",
};

const publishedBlogPostDetail = {
  ...publishedBlogPost,
  body_markdown: `## Start with constraints

Accessible publishing begins with clear structure, validated metadata, and predictable rendering.

### Keep the source of truth small

Use one published-content boundary so drafts never reach public readers.`,
};

function sendJson(response, status, body) {
  response.writeHead(status, {
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-origin": "*",
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

const server = createServer((request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-origin": "*",
    });
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (request.method === "GET" && request.url === "/content") {
    sendJson(response, 200, portfolioContent);
    return;
  }

  if (request.method === "GET" && request.url === "/v1/posts") {
    sendJson(response, 200, [publishedBlogPost]);
    return;
  }

  if (
    request.method === "GET" &&
    request.url === "/v1/posts/building-an-accessible-content-pipeline"
  ) {
    sendJson(response, 200, publishedBlogPostDetail);
    return;
  }

  if (request.method === "GET" && request.url === "/v1/posts/tags/accessibility") {
    sendJson(response, 200, [publishedBlogPost]);
    return;
  }

  if (request.method === "POST" && request.url === "/chat") {
    request.resume();
    sendJson(response, 200, {
      reply: "This deterministic response comes from the Playwright mock API.",
    });
    return;
  }

  sendJson(response, 404, { detail: "Not found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Playwright mock API listening on http://127.0.0.1:${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
