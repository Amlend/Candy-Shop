const candyForm = document.getElementById("candy-form");
const candyTable = document.getElementById("candy-table");
const candyTableBody = candyTable.querySelector("tbody");

const API_URL =
  "https://crudcrud.com/api/65ce2d23371b47c0abadb37057087e58/candies";

// Function to create a new candy object from form data
function createCandyObject(formData) {
  return {
    name: formData.get("candyName"),
    description: formData.get("description"),
    price: parseFloat(formData.get("price")),
    quantity: parseInt(formData.get("quantity")),
  };
}

// Function to update a candy table row based on candy object
function updateTableRow(candy) {
  const row = document.getElementById(candy.name);
  row.querySelector(".quantity").textContent = candy.quantity;
  if (candy.quantity === 0) {
    row.remove(); // Remove row if quantity reaches 0
  }
}

// Function to fetch candies from server
async function fetchCandies() {
  try {
    const response = await axios.get(API_URL);
    candyTableBody.innerHTML = ""; // Clear existing table
    response.data.forEach((candy) => createTableRow(candy));
  } catch (error) {
    console.error("Error fetching candies:", error);
  }
}

// Function to create a new candy on the server
async function createCandy(newCandy) {
  try {
    await axios.post(API_URL, newCandy);
    fetchCandies(); // Refresh the table after creation
  } catch (error) {
    console.error("Error creating candy:", error);
  }
}

// Function to update a candy's quantity on the server
async function updateQuantity(candy, quantityChange) {
  try {
    candy.quantity += quantityChange;
    if (candy.quantity < 0) {
      candy.quantity = 0; // Don't allow negative quantity
    }
    await axios.put(`${API_URL}/${candy._id}`, {
      name: candy.name,
      description: candy.description,
      price: candy.price,
      quantity: candy.quantity,
    });
    updateTableRow(candy);
  } catch (error) {
    console.error("Error updating candy:", error);
  }
}

// Function to create a new table row for a candy item
function createTableRow(candy) {
  const row = document.createElement("tr");
  row.id = candy.name;

  const nameCell = document.createElement("td");
  nameCell.textContent = candy.name;
  row.appendChild(nameCell);

  const descriptionCell = document.createElement("td");
  descriptionCell.textContent = candy.description;
  row.appendChild(descriptionCell);

  const priceCell = document.createElement("td");
  priceCell.textContent = `$${candy.price.toFixed(2)}`;
  row.appendChild(priceCell);

  const quantityCell = document.createElement("td");
  quantityCell.classList.add("quantity");
  quantityCell.textContent = candy.quantity;
  row.appendChild(quantityCell);

  const buttonContainer = document.createElement("td");
  buttonContainer.classList.add("button-container");
  row.appendChild(buttonContainer);

  const buy1Button = document.createElement("button");
  buy1Button.classList.add("button");
  buy1Button.textContent = "Buy 1";
  buy1Button.addEventListener("click", () => updateQuantity(candy, -1));
  buttonContainer.appendChild(buy1Button);

  const buy2Button = document.createElement("button");
  buy2Button.classList.add("button");
  buy2Button.textContent = "Buy 2";
  buy2Button.addEventListener("click", () => updateQuantity(candy, -2));
  buttonContainer.appendChild(buy2Button);

  const buy3Button = document.createElement("button");
  buy3Button.classList.add("button");
  buy3Button.textContent = "Buy 3";
  buy3Button.addEventListener("click", () => updateQuantity(candy, -3));
  buttonContainer.appendChild(buy3Button);

  candyTableBody.appendChild(row);
}

// Load candies from server on page load
fetchCandies();

//Checks whether candy present or not if present updates its quantity else creates new one
async function createFinalCandy(newCandy) {
  try {
    const response = await axios.get(API_URL);
    //   Check if candy already exists
    const existingCandy = response.data.find(
      (candy) => candy.name === newCandy.name
    );
    if (existingCandy) {
      updateQuantity(existingCandy, newCandy.quantity);
    } else {
      createCandy(newCandy);
    }
  } catch (error) {
    console.error("Error fetching candies:", error);
  }
}

// Handle form submission
candyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(candyForm);
  const newCandy = createCandyObject(formData);
  createFinalCandy(newCandy);
  candyForm.reset();
});
