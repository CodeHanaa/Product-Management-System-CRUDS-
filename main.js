document.addEventListener('DOMContentLoaded', function() {
    let title = document.getElementById('title');
    let price = document.getElementById('price');   
    let taxes = document.getElementById('taxes');   
    let ads = document.getElementById('ads');   
    let discount = document.getElementById('discount');   
    let total = document.getElementById('total');   
    let count = document.getElementById('count');   
    let category = document.getElementById('category');   
    let submit = document.getElementById('submit');

    let dataPro = localStorage.product ? JSON.parse(localStorage.product) : [];

    function getTotal() {
        if(price.value != '') {
            let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
            total.innerHTML = result;
            total.style.background = '#040';
        } else {
            total.innerHTML = '';
            total.style.background = '#a00d02';
        }
    }

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

    function readData() {
        getTotal();
        const tbody = document.getElementById('tbody');
        let table = '';
        if(dataPro.length === 0){
            table = `<tr id="emptyRow"><td colspan="10">Table Empty</td></tr>`;
        } else {
            dataPro.forEach((p, i) => {
                table += `
                <tr>
                    <td>${i+1}</td>
                    <td>${p.title}</td>
                    <td>${p.price}</td>
                    <td>${p.taxes}</td>
                    <td>${p.ads}</td>
                    <td>${p.discount}</td>
                    <td>${p.total}</td>
                    <td>${p.category}</td>
                    <td><button id="update" onclick="updateData(${i})">update</button></td>
                    <td><button id="delete" onclick="deleteData(${i})">delete</button></td>
                </tr>`;
            });
        }
        document.getElementById('deletAll').innerHTML = dataPro.length > 0 ? 
            `<button onclick="deleteAll()">Delete All (${dataPro.length})</button>` : '';
        tbody.innerHTML = table;
    }

    readData();

    submit.onclick = function() {
        let newPro = {
            title: title.value.toLowerCase(),
            price: price.value,
            taxes: taxes.value,
            ads: ads.value,
            discount: discount.value,
            total: total.innerHTML,
            count: count.value || 1,
            category: category.value.toLowerCase()
        };

        if(title.value != '' && price.value != '' && category.value != ''){
            let num = parseInt(newPro.count);
            if(num > 1){
                for(let i=0; i<num; i++){
                    dataPro.push({...newPro, count: 1});
                }
            } else {
                dataPro.push({...newPro, count: 1});
            }

            localStorage.setItem('product', JSON.stringify(dataPro));
            clearData();
            readData();
        }
    }

    window.deleteData = function(i){
        dataPro.splice(i,1);
        localStorage.setItem('product', JSON.stringify(dataPro));
        readData();
    }

    window.deleteAll = function(){
        localStorage.clear();
        dataPro = [];
        readData();
    }

    window.updateData = function(i){
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

        scroll({ top:0, behavior:"smooth" });

        submit.onclick = function(){
            dataPro[tmp].title = title.value;
            dataPro[tmp].price = price.value;
            dataPro[tmp].taxes = taxes.value;
            dataPro[tmp].ads = ads.value;
            dataPro[tmp].discount = discount.value;
            dataPro[tmp].total = total.innerHTML;
            dataPro[tmp].category = category.value;
            count.style.display = 'block';
            submit.innerHTML = 'create';
            localStorage.setItem('product', JSON.stringify(dataPro));
            clearData();
            readData();
        }
    }

    let searchMood = 'title';
    window.getSearchMood = function(id){
        searchMood = id === 'searchTitle' ? 'title' : 'category';
        const search = document.getElementById('search');
        search.placeholder = 'Search By ' + searchMood;
        search.focus();
        search.value = '';
        readData();
    }

    window.searchData = function(value){
        const tbody = document.getElementById('tbody');
        let table = '';
        let results = dataPro.filter(p => searchMood === 'title' ? p.title.includes(value.toLowerCase()) : p.category.includes(value.toLowerCase()));
        if(results.length === 0){
            table = `<tr><td colspan="10">لا توجد نتائج لبحثك</td></tr>`;
        } else {
            results.forEach((p, i)=>{
                table += `
                <tr>
                    <td>${i+1}</td>
                    <td>${p.title}</td>
                    <td>${p.price}</td>
                    <td>${p.taxes}</td>
                    <td>${p.ads}</td>
                    <td>${p.discount}</td>
                    <td>${p.total}</td>
                    <td>${p.category}</td>
                    <td><button id="update" onclick="updateData(${i})">update</button></td>
                    <td><button id="delete" onclick="deleteData(${i})">delete</button></td>
                </tr>`;
            });
        }
        tbody.innerHTML = table;
    }

    window.getTotal = getTotal;
});
