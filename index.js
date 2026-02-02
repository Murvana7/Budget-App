// Inputs
const totalAmount = document.getElementById("total-amount");
const userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");

// Errors
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");

// Outputs
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");

// List container
const list = document.getElementById("list");

let tempAmount = 0;

// Disable/Enable edit buttons
const disableButtons = (bool) => {
  const editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((btn) => (btn.disabled = bool));
};

// Set Budget
totalAmountButton.addEventListener("click", () => {
  tempAmount = Number(totalAmount.value);

  if (totalAmount.value === "" || tempAmount <= 0) {
    errorMessage.innerText = "Value cannot be empty or negative";
    errorMessage.classList.remove("hide");
    return;
  }

  errorMessage.classList.add("hide");
  amount.innerText = tempAmount;

  const spent = Number(expenditureValue.innerText);
  balanceValue.innerText = tempAmount - spent;

  totalAmount.value = "";
});

// Modify (edit/delete) expense item
const modifyElement = (element, edit = false) => {
  const parentDiv = element.parentElement;

  const parentAmount = Number(parentDiv.querySelector(".amount").innerText);
  const currentBalance = Number(balanceValue.innerText);
  const currentExpense = Number(expenditureValue.innerText);

  if (edit) {
    const parentText = parentDiv.querySelector(".product").innerText;
    productTitle.value = parentText;
    userAmount.value = parentAmount;

    disableButtons(true);
  }

  // remove old item totals
  balanceValue.innerText = currentBalance + parentAmount;
  expenditureValue.innerText = currentExpense - parentAmount;

  parentDiv.remove();
};

// Create one list row
const listCreator = (expenseName, expenseVal) => {
  const subListContent = document.createElement("div");
  subListContent.classList.add("sublist-content", "flex-space");

  subListContent.innerHTML = `
    <p class="product">${expenseName}</p>
    <p class="amount">${expenseVal}</p>
  `;

  const editButton = document.createElement("button");
  editButton.classList.add("edit");
  editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  editButton.addEventListener("click", () => modifyElement(editButton, true));

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.addEventListener("click", () => modifyElement(deleteButton));

  subListContent.appendChild(editButton);
  subListContent.appendChild(deleteButton);

  list.appendChild(subListContent);
};

// Add expense
checkAmountButton.addEventListener("click", () => {
  const expenseName = productTitle.value.trim();
  const expense = Number(userAmount.value);

  // Validate expense input
  if (!expenseName || userAmount.value === "" || isNaN(expense) || expense <= 0) {
    productTitleError.innerText = "Values cannot be empty";
    productTitleError.classList.remove("hide");
    return;
  }
  productTitleError.classList.add("hide");

  // Budget must be set
  const currentBudget = Number(amount.innerText);
  if (currentBudget <= 0) {
    errorMessage.innerText = "Please set a budget first";
    errorMessage.classList.remove("hide");
    return;
  }
  errorMessage.classList.add("hide");

  // Update totals
  const currentExpense = Number(expenditureValue.innerText);
  const newExpenseTotal = currentExpense + expense;

  expenditureValue.innerText = newExpenseTotal;
  balanceValue.innerText = currentBudget - newExpenseTotal;

  // Add list item
  listCreator(expenseName, expense);

  // Reset inputs + enable editing again
  productTitle.value = "";
  userAmount.value = "";
  disableButtons(false);
});
