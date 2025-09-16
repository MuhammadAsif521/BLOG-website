document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.getElementById("backToTop");
  const form = document.getElementById("contactForm");
  const blogGrid = document.getElementById("blogGrid");
  const blogSearchInput = document.getElementById("blogSearch");
  const blogSearchBtn = document.getElementById("blogSearchBtn");

  const isHomePage = window.location.pathname.includes("index.html");

  // Back to Top Button
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.style.display = window.scrollY > 200 ? "block" : "none";
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Contact Form Validation + Toast
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        alert("⚠️ Please fill in all required fields.");
        return;
      }

      const toastEl = document.getElementById("successToast");
      if (toastEl && window.bootstrap) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
      form.reset();
    });
  }

  // Blog posts data
  const titles = [
    "JavaScript Fundamentals","Advanced CSS Techniques","Node.js Crash Course","Getting Started with Angular",
    "MongoDB Performance Tips","TypeScript for Beginners","JWT Authentication Explained","Debugging Angular Apps",
    "Docker for Developers","CI/CD in Modern Web Dev","Accessibility in Web Design","Progressive Web Apps",
    "REST API Security","State Management with NgRx","GraphQL vs REST","Containerization with Docker",
    "Reactive Programming with RxJS","Unit Testing Best Practices","Real-Time Apps with Socket.io","Optimizing Angular Performance",
    "Design Patterns in JavaScript","Serverless with AWS Lambda","Microservices Architecture","Responsive Typography",
    "Cross-Browser Compatibility","Caching Strategies for Web","Performance Budgets in Frontend","WebSockets Deep Dive",
    "Data Visualization with D3.js","Ionic Framework Best Practices","Next.js vs Angular Universal","Tailwind CSS in Action",
    "Building Scalable APIs","Cloud Databases 101","Kubernetes Basics","Graph Databases with Neo4j",
    "Web Animations API","Frontend Testing with Cypress","Design Systems in Practice","Machine Learning in JavaScript",
    "SaaS App Architecture","WebAssembly Essentials","Static Site Generators","Headless CMS Explained",
    "AI in Web Development","Hybrid Mobile Apps with Ionic","The Future of ECMAScript","Securing Single Page Apps",
    "Blockchain for Developers","DevOps for MEAN Stack"
  ];

  const authors = [
    "John Doe", "Jane Smith", "Alex Carter", "Emily Johnson",
    "Michael Lee", "Sophia Turner", "David Brown", "Olivia Wilson",
    "Daniel Evans", "Grace Martin",
    "Muhammad Asif", "Ayesha Khan", "Omar Farooq", "Fatima Ali",
    "Yusuf Ahmed", "Maryam Siddiqui", "Bilal Hassan", "Zainab Noor",
    "Arjun Mehta", "Priya Sharma", "Ravi Patel", "Ananya Iyer",
    "Sanjay Gupta", "Kavya Nair", "Rohan Kapoor", "Lakshmi Menon",
    "Matthew Clark", "Angela Davis", "Paul Robinson", "Clara Thompson",
    "David Cohen", "Rachel Levi", "Eli Rosen", "Sarah Goldberg",
    "Tenzin Wangchuk", "Ananda Das", "Maya Chen", "Siddharth Lama",
    "Harpreet Singh", "Gurpreet Kaur", "Amritpal Gill", "Simranjeet Sandhu"
  ];

  const posts = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: titles[i % titles.length],
    author: authors[i % authors.length],
    date: new Date(
      2020,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60)
    ).toLocaleString(),
    image: "",
    description: `${titles[i % titles.length]} is a detailed guide covering theory and practice. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`
  }));

  const initialPosts = isHomePage ? posts.slice(0, 10) : posts;

  // Skeleton Loader
  function showSkeleton(count = 6) {
    if (!blogGrid) return;
    blogGrid.innerHTML = Array.from({ length: count })
      .map(
        () => `
        <div class="col-md-4 col-sm-6 col-12 mb-4">
          <div class="card h-100 blog-card placeholder-glow">
            <div class="card-img-top bg-secondary placeholder" style="height:200px;"></div>
            <div class="card-body">
              <h5 class="card-title placeholder col-8"></h5>
              <p class="card-text placeholder col-10"></p>
              <p class="card-text placeholder col-6"></p>
            </div>
          </div>
        </div>
      `
      )
      .join("");
  }

  // Fetch Images from Unsplash
  async function fetchImages() {
    if (!blogGrid) return;
    showSkeleton(initialPosts.length);
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?count=${initialPosts.length}&query=technology&client_id=wqlmqb_Uk8tyF9LMFc77W6teyC9nNmYKfHSVOTQ4ifI`
      );
      const data = await res.json();
      initialPosts.forEach((post, i) => {
        post.image = data[i]?.urls?.small || "https://placehold.co/720x480?text=No+Image";
      });
      renderPosts(initialPosts);
    } catch (err) {
      console.error("Error fetching images:", err);
      initialPosts.forEach(post => {
        post.image = "https://placehold.co/720x480?text=No+Image";
      });
      renderPosts(initialPosts);
    }
  }

  // Render posts
  function renderPosts(list) {
    if (!blogGrid) return;
    blogGrid.innerHTML = list
      .map(
        post => `
      <div class="col-md-4 col-sm-6 col-12 mb-4">
        <div class="card h-100 blog-card">
          <img src="${post.image}" class="card-img-top" alt="${post.title}" loading="lazy">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title blog-title">${post.title}</h5>
            <p class="card-text blog-description" data-id="${post.id}" data-full="${post.description}">
              ${post.description.slice(0, 120)}... 
              <span class="toggle-text text-primary" role="button">Read More</span>
            </p>
            <p class="card-text text-center mt-auto">
              <small class="text-body-secondary">${post.author} | ${post.date}</small>
            </p>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Expand/Collapse Description
  if (blogGrid) {
    blogGrid.addEventListener("click", e => {
      if (e.target.classList.contains("toggle-text")) {
        const p = e.target.closest(".blog-description");
        const fullText = p.getAttribute("data-full");
        const isExpanded = p.getAttribute("data-expanded") === "true";

        if (isExpanded) {
          p.innerHTML = fullText.slice(0, 120) + '... <span class="toggle-text text-primary">Read More</span>';
          p.setAttribute("data-expanded", "false");
        } else {
          p.innerHTML = fullText + ' <span class="toggle-text text-primary">Read Less</span>';
          p.setAttribute("data-expanded", "true");
        }
      }
    });
  }

  // Blog Search (only blog page)
  if (!isHomePage && blogSearchBtn && blogSearchInput) {
    function performSearch() {
      const q = (blogSearchInput.value || "").trim().toLowerCase();
      const filtered = q
        ? posts.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.author.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
          )
        : posts;
      renderPosts(filtered);
    }

    blogSearchBtn.addEventListener("click", performSearch);
    blogSearchInput.addEventListener("keyup", e => {
      if (e.key === "Enter") performSearch();
      if (blogSearchInput.value === "") renderPosts(posts);
    });
  }

  // Start fetching images and rendering posts
  fetchImages();
});
