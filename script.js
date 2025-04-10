const form = document.getElementById('itemForm');
const itemsList = document.getElementById('itemsList');
const imageInput = document.getElementById('image');
const preview = document.getElementById('preview');
const modal = document.getElementById('modal');

let items = JSON.parse(localStorage.getItem("lostFoundItems")) || [];
let pendingItem = null;

// Preview image
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const item = {
    type: document.getElementById('type').value,
    title: document.getElementById('title').value,
    location: document.getElementById('location').value,
    description: document.getElementById('description').value,
    name: document.getElementById('name').value,
    contact: document.getElementById('contact').value,
    image: preview.src || '',
    date: new Date().toLocaleString()
  };

  pendingItem = item;
  modal.style.display = "flex";
});

// Confirm from modal
function confirmSubmit(confirm) {
  modal.style.display = "none";
  if (confirm && pendingItem) {
    items.unshift(pendingItem);
    localStorage.setItem("lostFoundItems", JSON.stringify(items));
    form.reset();
    preview.style.display = "none";
    filterItems("all");
  }
  pendingItem = null;
}

// Show items based on filter + search
function filterItems(type) {
  const search = document.getElementById('search').value.toLowerCase();
  itemsList.innerHTML = "";

  const filtered = items.filter(i => {
    const matchType = type === "all" || i.type === type;
    const matchSearch = i.title.toLowerCase().includes(search);
    return matchType && matchSearch;
  });

  if (filtered.length === 0) {
    itemsList.innerHTML = "<p>No items found.</p>";
    return;
  }

  filtered.forEach(item => {
    const div = document.createElement("div");
    div.className = `item ${item.type}`;
    div.innerHTML = `
      <h3>${item.title} (${item.type.toUpperCase()})</h3>
      ${item.image ? `<img src="${item.image}" style="max-width:100%;border-radius:8px;margin-bottom:10px;" />` : ""}
      <p><strong>Location:</strong> ${item.location}</p>
      <p>${item.description}</p>
      <small>By ${item.name} | Contact: ${item.contact}</small><br/>
      <small>${item.date}</small>
    `;
    itemsList.appendChild(div);
  });
}

filterItems("all");
