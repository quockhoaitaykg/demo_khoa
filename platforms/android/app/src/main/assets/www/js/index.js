let index = -1;
const app = document.getElementById("app");

let products

try {
  getAllProducts().then(products => showProducts(products))
} catch(err) {
  app.innerHTML = err
}

function showProducts(products) {
  app.innerHTML = `<nav class="fixed-top navbar navbar-light bg-light">
                    <a class="navbar-brand" href="#">
                      <button type="button" id="btn-create" class="btn btn-danger">Create product</button>
                    </a>
                  </nav>`
  for (let i = 0; i < products.length; i++) {

    app.innerHTML += `<div class="card mt-5">
                            <img class="card-img-top" src="img/product-${i}.jpg" alt="Card image cap">
                            <div class="card-body">
                                <h5 class="card-title">${products[i].Name}</h5>
                                <p class="card-text">Quantity: ${products[i].Quantity}</p>
                                <p class="card-text">$${products[i].Price}</p>
                                <button type="button" index="${i}" class="btn btn-danger btn-update">
                                    Update
                                </button>
                                <button type="button" index="${i}" class="btn btn-danger btn-delete" data-toggle="modal" data-target="#exampleModal">
                                    Delete
                                </button>
                            </div>
                        </div>`;
  }

  const updateButtons = document.getElementsByClassName("btn-update")
  const deleteButtons = document.getElementsByClassName("btn-delete")

  for (const btn of updateButtons) {
    btn.addEventListener("click", event => {
      index = event.target.getAttribute("index")
      goToUpdateScr(products[index], 'update')
    })
  }

  for (const btn of deleteButtons) {
    btn.addEventListener("click", event => {
      index = event.target.getAttribute("index")
    })
  }

  document.getElementById("btn-yes").addEventListener("click", event => {
    deleteProduct(products[index].Id).then(response => {
      $('#exampleModal').modal('hide')

      getAllProducts().then(products => {
        showProducts(products)
      })
    })
  })

  document.getElementById('btn-create').addEventListener("click", event => {
    goToUpdateScr({
      Name: '',
      Quantity: '',
      Price: ''
    }, 'create')
  })
}

function goToUpdateScr(product, category) {
  app.innerHTML = `<form id="update-form">
                    <div class="form-group">
                      <label for="txtName">Product name</label>
                      <input type="text" value="${product.Name}" class="form-control" id="txtName" placeholder="Enter name...">
                    </div>
                    <div class="form-group">
                      <label for="txtQuantity">Quantity</label>
                      <input type="text" value="${product.Quantity}" class="form-control" id="txtQuantity" placeholder="Enter quantity...">
                    </div>
                    <div class="form-group">
                      <label for="txtPrice">Price</label>
                      <input type="text" value="${product.Price}" class="form-control" id="txtPrice" placeholder="Enter price...">
                    </div>
                    <button id="btn-back" class="btn btn-primary">Back</button>
                    <button id="btn-update" class="btn btn-primary">Submit</button>
                  </form>`;

  document.getElementById("btn-back").addEventListener("click", event => {
    getAllProducts().then(products => showProducts(products))
  })

  document.getElementById("update-form").addEventListener("submit", event => {
    event.preventDefault();
  })

  document.getElementById("btn-update").addEventListener("click", event => {
    const data = {
      id: product.Id,
      name: $("#txtName").val(),
      quantity: parseInt($("#txtQuantity").val()),
      price: parseFloat($("#txtPrice").val())
    }

    if (category === 'update') {
      updateProduct(data).then(response => {
        getAllProducts().then(products => {
          showProducts(products)
        })
      })
    } else {
      createProduct(data).then(response => {
        getAllProducts().then(products => {
          showProducts(products)
        })
      })
    }
  })
}

function getAllProducts() {
  return new Promise((resolve, reject) => {
    fetch('https://demo-crud-ny4.conveyor.cloud/api/products')
      .then(response => response.json())
      .then(products => resolve(products))
      .catch(reason => reject(reason))
  })
}

function createProduct(product) {
  return new Promise((resolve, reject) => {
    fetch(`https://demo-crud.conveyor.cloud/api/products`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
      .then(response => resolve(response))
      .catch(reason => reject(reason))
  })
}

function updateProduct(product) {
  return new Promise((resolve, reject) => {
    fetch(`https://demo-crud.conveyor.cloud/api/products/${product.id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
      .then(response => resolve(response))
      .catch(reason => reject(reason))
  })
}

function deleteProduct(id) {
  return new Promise((resolve, reject) => {
    fetch(`https://demo-crud.conveyor.cloud/api/products/${id}`, { method: "DELETE" })
      .then(response => resolve(response))
      .catch(reason => reject(reason))
  })
}