let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');   
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');

// create total function
function getTotal() {
    if (price.value != '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = '#040';
    } else {
        total.innerHTML = '';
        total.style.background = '#a00d02';
    }
}

//create inputs
//data product array 
let dataPro;
//check local storage 
if (localStorage.product != null) {
    //get data from local storage
    dataPro = JSON.parse(localStorage.product);
} else {
    dataPro = [];
}

//submit button 
submit.onclick = function() {
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value.toLowerCase(),
        taxes: taxes.value.toLowerCase(),
        ads: ads.value.toLowerCase(),
        discount: discount.value.toLowerCase(),
        total: total.innerHTML,
        count: count.value.toLowerCase(),
        category: category.value.toLowerCase(),
    }
     if (title.value != '' && price.value != '' && category.value != '' && newPro.count < 100) {
        if (newPro.count > 1) {
            for (let i = 0; i < newPro.count; i++) {  
                dataPro.push(newPro);
            } 
        } else {
            dataPro.push(newPro);
            clearData();
        }
    }
    //save to local storage
    localStorage.setItem('product', JSON.stringify(dataPro));
    // clearData();
    readData();
}
        
//save local storage
//clear inputs
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}

//read products  
function readData() {
  getTotal();

  const tbody = document.getElementById('tbody');
  let table = '';

  // لو مفيش منتجات
  if (dataPro.length === 0) {
    table = `
      <tr id="emptyRow">
        <td colspan="10">Table Empty</td>
      </tr>
    `;
  } else {
    // لو فيه بيانات
    for (let i = 0; i < dataPro.length; i++) {
      table += `
        <tr>
          <td>${i + 1}</td>
          <td>${dataPro[i].title}</td>
          <td>${dataPro[i].price}</td>    
          <td>${dataPro[i].taxes}</td>
          <td>${dataPro[i].ads}</td>
          <td>${dataPro[i].discount}</td>
          <td>${dataPro[i].total}</td>
          <td>${dataPro[i].category}</td>
          <td><button id="update" onclick="updateData(${i})">update</button></td>
          <td><button id="delete" onclick="deleteData(${i})">delete</button></td>
        </tr>
      `;
    }

  }
  if (dataPro.length > 0) {
    document.getElementById('deletAll').innerHTML = `
      <button onclick="deleteAll()">Delete All (${dataPro.length})</button>
    `;
  } else {
    document.getElementById('deletAll').innerHTML = '';
  }

  // نحدث محتوى الجدول
  tbody.innerHTML = table;
}
readData();

//delete product
function deleteData(i) {
    dataPro.splice(i, 1);
    //update local storage
    localStorage.product = JSON.stringify(dataPro);
    readData();
}

//delete all products
function deleteAll() {
    localStorage.clear();
    dataPro.splice(0);
    readData();
}

//update product
function updateData(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    getTotal();
    category.value = dataPro[i].category;
    count.style.display = 'none';
    submit.innerHTML = 'update';    
    let tmp = i;
    scroll({
            top: 0,
            behavior: "smooth",
        });
    submit.onclick = function() {
        dataPro[tmp].title = title.value;
        dataPro[tmp].price = price.value;
        dataPro[tmp].taxes = taxes.value;
        dataPro[tmp].ads = ads.value;
        dataPro[tmp].discount = discount.value;
        dataPro[tmp].total = total.innerHTML;
        dataPro[tmp].category = category.value;
        count.style.display = 'block';
        submit.innerHTML = 'create';
        localStorage.product = JSON.stringify(dataPro);
        clearData();
        readData();
    }
}

//search product by title or category
let searchMood = 'title';
function getSearchMood(id) {
    let search = document.getElementById('search'); 
    if (id == 'searchTitle') {
        searchMood = 'title';
    } else {
        searchMood = 'category';
    }
    search.placeholder = 'Search By ' + searchMood;
    search.focus();
    search.value = '';
    readData();
}
function searchData(value) {
    const tbody = document.getElementById('tbody');
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        if (searchMood == 'title') {
            if (dataPro[i].title.includes(value.toLowerCase())) {
                table += `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td><button id="update" onclick="updateData(${i})">update</button></td>
                    <td><button id="delete" onclick="deleteData(${i})">delete</button></td>
                  </tr>
                `;
            }
        } else {
            if (dataPro[i].category.includes(value.toLowerCase())) {
                table += `
                  <tr>  
                    <td>${i + 1}</td>   
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td><button id="update" onclick="updateData(${i})">update</button></td>
                    <td><button id="delete" onclick="deleteData(${i})">delete</button></td>
                  </tr>
                `;
            }
        }
    }
    tbody.innerHTML = table;
}



