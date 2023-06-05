"use strict";

// Fetching all kids data

fetch("http://127.0.0.1:3000/api/kids/allkids")
  .then(handleResponse)
  .then((responseData) => {
    document.body.insertAdjacentHTML("afterbegin", tableBlueprint());
    document.body.insertAdjacentHTML("afterbegin", insertModal());
    document.body.insertAdjacentHTML("afterbegin", insertModalEdit());

    console.log("Raw response", responseData);

    const tableBody = document.querySelector("tbody");

    // Sort kids by age and store in separate variables
    const kids0to2 = responseData.data.Kids.filter(
      (kid) => kid.age >= 0 && kid.age < 2
    );
    const kids2to4 = responseData.data.Kids.filter(
      (kid) => kid.age >= 2 && kid.age <= 4
    );
    const kids4Plus = responseData.data.Kids.filter((kid) => kid.age > 4);

    console.log(kids0to2);
    console.log(kids2to4);
    console.log(kids4Plus);

    // Utility variable to number rows in a sequencial order

    let counter = [];

    // Sort kids within each variable alphabetically by name

    function insertAndColorRows(kids, color) {
      kids
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((el) => {
          el.color = color;
          el.count = 1 + counter.length;
          console.log(el);
          counter.push("");
          tableBody.insertAdjacentHTML("beforeend", insertTableRows(el));
        });
    }

    insertAndColorRows(kids0to2, "green");
    insertAndColorRows(kids2to4, "blue");
    insertAndColorRows(kids4Plus, "red");

  

    // These select buttons INSIDE the modal windows. Dont confuse with table buttons.
    const printButton = document.querySelector(".button-print");
    const saveButton = document.querySelector(".modal-footer .save");
    const deleteButton = document.querySelector(".modal-footer .delete");
    const editButtons = document.querySelectorAll(".edit-button");
    const createRecordButton = document.querySelector(".button-newRecord");

    // DELETE button

    deleteButton.addEventListener("click", (e) => {
      console.log("click");
      deleteRecord(e);
    });

    let editToCreateToggle = "";

    // EDIT button

    editButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        document.querySelector("#editRecord .modal-title").innerHTML =
          "Edit existing record";
        editToCreateToggle = "edit";
        console.log(editToCreateToggle);

        saveButton.setAttribute(
          "data-index",
          e.target.getAttribute("data-index")
        );
      });
    });

    saveButton.addEventListener("click", (e) => {
      console.log("clicked");
      editToCreateToggle == "edit" ? updateExistingRecord(e) : postNewRecord();
    });

    // BUTTON CREATE NEW RECORD

    createRecordButton.addEventListener("click", (e) => {
      editToCreateToggle = "create";
      document.querySelector("#editRecord .modal-title").innerHTML =
        "Create new record";
      console.log(editToCreateToggle);
    });

    // BUTTON SEND TO PRINT

    printButton.addEventListener("click", (e) => {
      fetch(`http://127.0.0.1:3000/api/send-email`, {
        method: "POST",
      })
        .then(() => {
          alert("Email sent successfully");
        })
        .catch((error) => {
          console.error("Error sending email: ", error);
        });
    });



  })
  .catch((err) => {
    console.log("Fetch error: " + err);
  });

// HELPER FUNCTIONS

// DOM HELPER FUNCTIONS

function tableBlueprint() {
  return `
  <body>
  <table class="table full-width-table table-striped container-fluid table-responsive">
    <colgroup">
      <col style="width: 5%" />
      <col style="width: 25%" />
      <col style="width: 5%" />
      <col style="width: 35%" />
      <col style="width: 15%" />
      <col style="width: 15%" />
      <col style="width: 10%" /> 
    </colgroup>
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">NAME</th>
        <th scope="col" class="text-center">AGE</th>
        <th scope="col" class="text-center">DAYS</th>
        <th scope="col"></th>
        <th scope="col">
          <button class="btn btn-danger btn-primary btn-sm button-print">SEND TO PRINT</button>
        </th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
    `;
}

function insertTableRows(data, counter) {
  const html = `
  <tr>
  <th scope="row">${data.count}</th>
  <td style="color: ${data.color}">${data.name}</td>
  <td class="text-center">${data.age}</td>
  <td>
    <div class="h-100 text-center d-flex justify-content-between">
      <div class="col day monday">${
        data.days.includes("Mo") ? "Mo" : "&#10005"
      }</div>
      <div class="col day tuesday">${
        data.days.includes("Tu") ? "Tu" : "&#10005"
      }</div>
      <div class="col day wednesday">${
        data.days.includes("We") ? "We" : "&#10005"
      }</div>
      <div class="col day thursday">${
        data.days.includes("Th") ? "Th" : "&#10005"
      }</div>
      <div class="col day friday">${
        data.days.includes("Fr") ? "Fr" : "&#10005"
      }</div>
    </div>
  </td>
  <td class="text-center edit">
    <button type="button" data-index="${
      data._id
    }" class="btn btn-primary btn-sm edit-button" data-toggle="modal" data-target="#editRecord">
      EDIT
    </button>
  </td>
  <td class="text-center modal-delete">
    <button type="button" data-index="${
      data._id
    }" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#deleteWarning">
      DELETE
    </button>
  </td>
</tr>`;
  return html;
}

function insertModal() {
  return `
  <div class="modal fade" id="deleteWarning" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Warning</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        You are going to delete a record, would you like to proceed?
      </div>
      <div class="modal-footer justify-content-between">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Go Back</button>
        <button type="button" class="btn btn-primary delete">Delete</button>
      </div>
    </div>
  </div>
</div>
`;
}

function insertModalEdit() {
  return `
  <div class="modal fade" id="editRecord" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle"></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
       
        <form>
          <div class="form-group">
            <label for="name">Name:</label>
            <input
              type="text"
              class="form-control"
              id="name"
              aria-describedby="kidName"
              placeholder="Enter full name"
            />
          </div>

          <div class="form-group">
            <label for="age">Age:</label>
            <input
              type="number"
              class="form-control"
              id="age"
              aria-describedby="kidName"
              placeholder="Enter age"
            />
          </div>

          <div class="form-group">
            <label for="days">Days:</label>
            <div class="d-flex justify-content-center">
              <div class="form-check mr-5 form-check-inline flex-column">
                <label class="form-check-label mb-3" for="monday">Mo</label>
                <input class="form-check-input" type="checkbox" id="monday" name="days" value="Mo">
              </div>
              <div class="form-check mr-5 form-check-inline flex-column">
                <label class="form-check-label mb-3" for="tuesday">Tu</label>
                <input class="form-check-input" type="checkbox" id="tuesday" name="days" value="Tu">
              </div>
              <div class="form-check mr-5 form-check-inline flex-column">
                <label class="form-check-label mb-3" for="wednesday">We</label>
                <input class="form-check-input" type="checkbox" id="wednesday" name="days" value="We">
              </div>
              <div class="form-check mr-5 form-check-inline flex-column">
                <label class="form-check-label mb-3" for="thursday">Th</label>
                <input class="form-check-input" type="checkbox" id="thursday" name="days" value="Th">
              </div>
              <div class="form-check mr-5 form-check-inline flex-column">
                <label class="form-check-label mb-3" for="friday">Fr</label>
                <input class="form-check-input" type="checkbox" id="friday" name="days" value="Fr">
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Go Back</button>
            <button type="submit" class="btn btn-primary save" data-index = "" >Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
`;
}

function insertConfirmationDelete() {
  return `
      <div class = modal-1>
          <div class = modal-header>
              <button class = close> ${"&#10005"}
              </button>
          </div>
          <div class = "modal-body delete">
                  <div>
                    <h3> Are you sure you want to delete this record? </h3>
                   </div>
                  <div class = action >
                      <button class = "submit" type="submit">DELETE</button>
                      <button class = "abort">GO BACK</button>
              </form>
          </div>
          <div class = modal-footer> 
          </div>
      </div>`;
}

// CRUD helper functions

function handleResponse(response) {
  if (!response.ok) {
    throw new Error("Problem with the request");
  }
  return response.json();
}

//DELETE
function deleteRecord(e) {
  const kidId = e.target.getAttribute("data-index");

  fetch(`http://127.0.0.1:3000/api/kids/allkids?id=${kidId}`, {
    method: "DELETE",
  }).then(() => location.reload());
}

// UPDATE RECORD
function updateExistingRecord(e) {
  const kidId = e.target.getAttribute("data-index");
  console.log(kidId);
  const form = document.querySelector("#editRecord form");
  console.log(form);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value;
    const age = form.querySelector("#age").value;
    const newDays = Array.from(
      form.querySelectorAll('input[name="days"]:checked')
    ).map((checkbox) => checkbox.value);

    console.log("NEW DAYS", newDays);

    function daysSchema() {
      this.Monday = newDays.includes("Mo") ? "Mo" : "";
      this.Tuesday = newDays.includes("Tu") ? "Tu" : "";
      this.Wednesday = newDays.includes("We") ? "We" : "";
      this.Thursday = newDays.includes("Th") ? "Th" : "";
      this.Friday = newDays.includes("Fr") ? "Fr" : "";
    }

    const daysObject = new daysSchema();
    const days = Object.values(daysObject).filter(Boolean);
    console.log(days);
    const formData = { name, age, days };

    fetch(`http://127.0.0.1:3000/api/kids/allkids?id=${kidId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(handleResponse)
      .then((data) => {
        console.log("Form submitted succesfully:", data);
      })
      .then(() => location.reload());
  });
}

// POST NEW

function postNewRecord() {
  const form = document.querySelector("#editRecord form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value;
    const age = form.querySelector("#age").value;
    const days = Array.from(
      document.querySelectorAll('input[name="days"]:checked')
    ).map((checkbox) => checkbox.value);

    //Merging existing days with new input
    const formData = { name, age, days };

    fetch(`http://127.0.0.1:3000/api/kids/allkids`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(handleResponse)
      .then((data) => {
        console.log("Form submitted succesfully:", data);
      })
      .then(() => location.reload());
  });
}

// UPDATE RECORD
