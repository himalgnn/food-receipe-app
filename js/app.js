// Declarations
const searchBtn = document.getElementById("search-btn");
const mealDetailsContent = document.querySelector(".meal-details-content");
const receipeCloseBtn = document.getElementById("receipe-close-btn");
const mealSearch = document.getElementById("meal-search");
const searchInput = document.getElementById("search-input");
let searchResultsTitle = document.getElementById("search-results-title");
let mealList = document.getElementById("meal");
let loader = document.getElementById("loading");
const mealDetails = document.getElementById('meal-details')

// Event listeners
searchBtn.addEventListener("click", getMealList);
searchInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        getMealList();
    }
});

// Get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById("search-input").value.trim();
    if (searchInputTxt.length != 0) {
        displayLoading();
        mealList.innerHTML = "";
        searchResultsTitle.innerHTML = "";
        fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
        )
            .then((response) => response.json())
            .then((data) => {
                mealSearch.style = "max-height:30vh";
                if (data.meals != null) {
                    hideLoading();
                    console.log(data.meals);
                    searchResultsTitle.innerHTML = `Search Results: (${data.meals.length} items)`;
                    data.meals.forEach((element) => {
                        mealList.innerHTML += `
                        <!-- Meal item -->
                            <div class="meal-item">
                                <div class="meal-img">
                                    <img src="${element.strMealThumb}" alt="Food">
                                </div>
                                <div class="meal-name">
                                    <h3>${element.strMeal}</h3>
                                    <a href="javascript:void(0)" onclick="getReceipe(${element.idMeal})" class="receipe-btn">Get Receipe</a>
                                </div>
                            </div>

                            <!-- End of meal item -->
                `;
                    });
                } else {
                    hideLoading();
                    searchResultsTitle.innerHTML = "No Results Found";
                }
            });
    }
}

// Get Receipe of selected item
function getReceipe(meal_id){
    console.log('get run');
    mealDetails.style.display = "block";
    mealDetails.innerHTML = ""
    displayLoading();
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal_id}`)
        .then((response) => response.json())
        .then((data) => {
            hideLoading()
            console.log(data);
            mealDetails.innerHTML = `

            <!-- Receipe Close Btn -->
                <button type="button" class="btn receipe-close-btn" onclick="closeReceipeBtn()" id="receipe-close-btn">
                    <i class="fas fa-times"></i>
                </button>

                <!-- Meal Content -->
                <div class="meal-details-content">
                
                    <h2 class="receipe-title">${data.meals[0].strMeal}</h2>
                     <div class="receipe-meal-img">
                            <img src="${data.meals[0].strMealThumb}" alt="Food">
                        </div><br>
                    <p class="receipe-category">Category: ${data.meals[0].strCategory}</p>
                    
                    <table id="meal-details-table">
                        <tr>
                            <th>Ingredients</th>
                            <th>Quantity</th>
                        </tr>
                    </table>
                    <div class="receipe-instruct">
                        <h3>Instructions: </h3>
                        <p>${data.meals[0].strInstructions}</p>

                       
                        <div class="receipe-link">
                            <a href="${data.meals[0].strYoutube}" target="_blank">Watch Video</a>
                        </div>
                    </div>
                </div>
            `
            data.meals.forEach((element)=>{ //This foreach is for fetching ingredients & quantity from api and add it to table with id 'meal-details-table'
                for(i=1;i<=20;i++){
                    let str1 = eval(`element.strIngredient${i}`) //Eval executes code inside string too so it's used
                    let str2 = eval(`element.strMeasure${i}`)
                    if(str1!="" && str2!="" && str1!=null && str2!=null){
                        document.getElementById('meal-details-table').innerHTML +=`
                        <tr>
                            <td>${str1}</td>
                            <td>${str2}</td>
                        </tr>
                        `
                    }
                }
            })
        });
}

// Close receipe details
function closeReceipeBtn(){
    mealDetails.style.display = "none"
}

// Close Recepie details on "Esc" key pressed
window.addEventListener('keydown', (e)=>{
    if(e.key==="Escape"){
        closeReceipeBtn()
    }        
})

// showing loading
function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time
    setTimeout(() => {
        loader.classList.remove("display");
    }, 5000);
}

// hiding loading
function hideLoading() {
    loader.classList.remove("display");
}

// Hide Empty Rows from table
function hideEmptyRows_ofTableById(){
    var rows = document.getElementsByTagName('td');
  
    for(var i = 0; i < rows.length; i++) {
      if(rows[i].innerHTML=="") {
        rows[i].style.display = 'none';
      }
    }
  }
  