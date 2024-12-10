export function renderWeightContainer(parent) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const user = users[sessionStorage.getItem("currentUser")];

  user.weightHistory = user.weightHistory || [];

  // Create the Current Weight container
  const weightContainer = document.createElement("div");
  weightContainer.style.width = "100%";
  weightContainer.classList.add("sub-container");
  weightContainer.id = "weight-container";

  const currentWeightTag = document.createElement("span");
  currentWeightTag.textContent = "Current Weight : ";

  weightContainer.appendChild(currentWeightTag);

  let currentWeight = "-";
  if (user.weightHistory.length > 0) {
    currentWeight = `${
      user.weightHistory[user.weightHistory.length - 1].weight
    } lb`;
  }

  const weightValue = document.createElement("span");
  weightValue.id = "current-weight-value";
  weightValue.style.margin = "0 1.5em";
  weightValue.textContent = currentWeight;
  weightContainer.appendChild(weightValue);

  const editButton = document.createElement("button");
  editButton.id = "edit-weight-button";
  editButton.innerHTML = `
    <span class="material-symbols-outlined">
      edit
    </span>`;
  editButton.style.marginLeft = "auto";
  weightContainer.appendChild(editButton);

  editButton.addEventListener("click", () => {
    if (
      editButton.innerHTML.includes(`<span class="material-symbols-outlined">
      edit
    </span>`)
    ) {
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.value = currentWeight !== "-" ? currentWeight : "";
      input.placeholder = "(in lbs)";
      weightContainer.replaceChild(input, weightValue);
      editButton.innerHTML = `
        <span class="material-symbols-outlined">
          save
        </span>`;
    } else {
      const input = weightContainer.querySelector("input");
      const newWeight = input.value.trim();
      if (newWeight === "" || isNaN(newWeight)) {
        // Invalid input, revert
        weightContainer.replaceChild(weightValue, input);
        editButton.innerHTML = `<span class="material-symbols-outlined">
          edit
          </span>`;
        return;
      }
      const date = new Date().toISOString().split("T")[0];

      const newEntry = { date, weight: parseFloat(newWeight) };

      // Check if there's already an entry for this date
      const existingIndex = user.weightHistory.findIndex(
        (entry) => entry.date === date
      );

      if (existingIndex !== -1) {
        user.weightHistory[existingIndex].weight = newEntry.weight;
      } else {
        user.weightHistory.push(newEntry);
      }

      // After adding the new weight entry
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // Filter weightHistory to only keep entries from last 6 months
      user.weightHistory = user.weightHistory.filter((entry) => {
        return new Date(entry.date) >= sixMonthsAgo;
      });

      localStorage.setItem("users", JSON.stringify(users));

      currentWeight = `${newWeight} lb`;
      weightValue.textContent = currentWeight;
      weightContainer.replaceChild(weightValue, input);
      editButton.innerHTML = `<span class="material-symbols-outlined">
        edit
        </span>`;

      // Update the chart after saving new weight
      //updateWeightChart();
    }
  });

  parent.appendChild(weightContainer);
}
