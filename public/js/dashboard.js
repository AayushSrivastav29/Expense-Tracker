document.addEventListener("DOMContentLoaded", initialize);
let currentlyEditingId = null;
let currentPage = 1;
let itemsPerPage;
let rows;
let allExpenses = [];
let token;
const path = "http://65.1.134.87";

function initialize() {
  token = localStorage.getItem("token");

  if (localStorage.getItem("isPremium") === "true") {
    updatePremiumUI();
    document.querySelector("#downloadexpense").style.display = "block";
  }else{
    document.querySelector("#leaderboard").style.display = "none";
    leaderboardMessage();
  }
  

  //fetch name
  const name = localStorage.getItem("name");
  document.querySelector("#name").textContent = `Hi, ${name}!`;

  //fetch rows
   itemsPerPage = Number(localStorage.getItem('rows') || 5);
  
  // Initialize premium button
  document
    .getElementById("buyPremiumBtn")
    .addEventListener("click", handlePremiumUpgrade);
    
  // Load initial data
  fetchExpenses();
  
  // Attach form submit handler
  document.querySelector("form").addEventListener("submit", handleFormSubmit);
}



// Fetch all expenses
function fetchExpenses() {
  axios
  .get(`${path}/api/expense/`, {
    headers: { Authorization: token },
  })
  .then((result) => {
    allExpenses = result.data;
    //console.log(allExpenses);
    renderPage(currentPage); // Render first page initially
    renderPaginationControls();
  })
  .catch((err) => {
    alert(`Error in fetching data`);
  });
}

document.querySelector('#expense-rows').addEventListener('change', (event)=>{
  rows = event.target.value;
  localStorage.setItem('rows',rows);
  itemsPerPage=rows;
  fetchExpenses();

})

// Render a specific page
function renderPage(page) {
  currentPage = page;
  const ul = document.querySelector("ul");
  ul.innerHTML = ""; // Clear current items
  //console.log("currentPage ", currentPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageExpenses = allExpenses.slice(startIndex, endIndex);

  //console.log("pageExpenses.length", pageExpenses.length);
  pageExpenses.forEach((expense) => {
    display(expense);
  });
  // renderPaginationControls();
}

// Render pagination controls
function renderPaginationControls() {
  const totalPages = Math.ceil(allExpenses.length / itemsPerPage);
  const existingPagination = document.querySelector(".pagination");
  const paginationDiv = existingPagination || document.createElement("div");
  paginationDiv.className = "pagination";
  paginationDiv.innerHTML = ""; // Clear existing controls

  // Previous button
  const prevButton = document.createElement("button");
  prevButton.textContent = "<";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => renderPage(currentPage - 1));
  paginationDiv.appendChild(prevButton);

  // currentPage numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = currentPage === i ? "active" : "";
    pageButton.addEventListener("click", () => renderPage(i));
    paginationDiv.appendChild(pageButton);
  }

  // Next button
  const nextButton = document.createElement("button");
  nextButton.textContent = ">";
  nextButton.disabled = currentPage === totalPages;

  nextButton.addEventListener("click", () => renderPage(currentPage + 1));
  paginationDiv.appendChild(nextButton);
   if (!existingPagination) {
    document.querySelector('#expense-list').appendChild(paginationDiv);
  }
}

// Handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();

  if (currentlyEditingId) {
    await updateData();
  } else {
    await addData();
  }
  // Reset form and clear editId
  event.target.reset();
  currentlyEditingId = null;
  document.querySelector("form button").textContent = "Add";
  fetchExpenses();
}

// Add new expense
async function addData() {
  const amount = document.querySelector("#amount").value;
  const description = document.querySelector("#description").value;
  const category = document.querySelector("#category").value;

  const expenseDetails = {
    amount,
    description,
    category,
  };

  await axios.post(`${path}/api/expense/add`, expenseDetails, {
    headers: { Authorization: token },
  });
}

// Display user on screen
function display(expense) {
  const ul = document.querySelector("ul");
  const li = document.createElement("li");
  li.setAttribute("data-id", expense.id);

  const text = document.createTextNode(
    `${expense.amount} ${expense.description} ${expense.category}`
  );
  li.appendChild(text);

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteData(expense.id, li));
  li.appendChild(deleteBtn);

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editData(expense));
  li.appendChild(editBtn);

  ul.appendChild(li);
}

// Delete expense from local storage and DOM
async function deleteData(id, li) {
  await axios
    .delete(`${path}/api/expense/delete/${id}`, {
      headers: {
        Authorization: token,
      },
    })
    .then(() => {
      li.remove();
      // Refresh the data
      fetchExpenses();
    })
    .catch((err) => {
      alert("Error in deleting expense");
    });

}

// Populate form for editing
function editData(expense) {
  document.querySelector("#amount").value = expense.amount;
  document.querySelector("#description").value = expense.description;
  document.querySelector("#category").value = expense.category;

  currentlyEditingId = expense.id;

  document.querySelector("form button").textContent = "Update";
}

async function updateData() {
  const amount = document.querySelector("#amount").value;
  const description = document.querySelector("#description").value;
  const category = document.querySelector("#category").value;

  let updatedData = {
    amount,
    description,
    category,
  };

  try {
    const updatedResult = await axios.put(
      `${path}/api/expense/edit/${currentlyEditingId}`,
      updatedData
    );
    //console.log("updated successfully", updatedResult);

  } catch (error) {
    alert("Error updating expense:", error);
  }
}

//logout feature
const logout = document.querySelector("#logout");

logout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/home.html";
});

// Premium Upgrade Handler
function handlePremiumUpgrade() {
  if (!token) {
    alert("Please login first");
    return;
  }

  const buyPremiumBtn = document.getElementById("buyPremiumBtn");

  buyPremiumBtn.disabled = true;
  buyPremiumBtn.innerHTML =
    '<span class="spinner-border spinner-border-sm"></span> Processing';

  window.location.href = "/paymentPage.html";
}

function updatePremiumUI() {
  document.getElementById("premiumBadge").classList.remove("d-none");
  document.getElementById("buyPremiumBtn").style.display = "none";
}

//leaderboard functionality

const leaderBtn = document.querySelector("#leaderboard");
const leaderboard = document.querySelector("#leaderboard-list");

function leaderboardMessage(){
  const message = document.querySelector('#leaderboard-message');
  message.textContent=`Upgrade to premium to view content!`;
  message.style.display='block';
}

leaderBtn.addEventListener("click", async () => {
  document.querySelector("#leaderboard-list > h4").style.visibility = "visible";
  const ul = document.createElement("ul");
  const list = await axios.get(`${path}/api/premium/leaderboard `);
  const listArr = list.data.data;

  listArr.forEach((data) => {
    const li = document.createElement("li");
    li.textContent = `Name: ${data.userName} , Total Expenses: ${data.totalExpenses}`;
    ul.appendChild(li);
  });

  leaderboard.appendChild(ul);
});

//download expense feature
function download() {
  axios
    .get(`${path}/api/expense/download`, {
      headers: { Authorization: token }
    })
    .then((response) => {
      if (response.status===200) {
        const link = document.createElement('a');
        link.href= response.data.fileUrl;
        console.log(link);
        link.download = 'expenses.csv';
        link.click();
      }
    })
    .catch((err) => {
      alert("Failed to download expenses");
    });
}
