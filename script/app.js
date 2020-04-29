// stoping the submission to prevent reloading
const form = document.querySelector(".topcontend form"); 
const input = document.querySelector(".topcontend input");
const msg = document.querySelector(".topcontend .message");
const list = document.querySelector(".weathersection .cities");

const apiKey = "f1028fd8fd11f7c86bd2aae506ad7084"; // API key

// getting the data from search field (user input)
form.addEventListener("submit", eve => {
  eve.preventDefault();
  let inputVal = input.value; //getting user input value

  //checking the list is empty or not
  const listItems = list.querySelectorAll(".weathersection .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {// if there is item in the list do this
    // checking the stored attribute is equel to user input (search field value)
    const filteredArray = listItemsArray.filter(elem => {
      let content = "";
      // checking user input contain country code
      if (inputVal.includes(",")) {
        //taking only the first part of user input (data from text field) and converting text content to lowercase
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = elem.querySelector(".city-name span").textContent.toLowerCase();
        }else {// else do this
          content = elem.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {// else do this
        //athens
        content = elem.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase(); //return inputvalue in lowercase
    });
    // if the attribute is equel to user input (search field value) will do this
    if (filteredArray.length > 0) {
      //printing message
      msg.textContent = `The weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
        } is Already in the list below. if its not, please enter country code along with city name(eg: Dublin,ie)`;
      form.reset(); //reseting form
      input.focus(); //focusing in the input field (for user input)
      return; // return
    }
  }

  //ajax section
  //url API request (with city name)
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url) //passing the url in fetch method
    .then(response => response.json()) //response object method to grab the response data
    .then(data => {
      const { main, name, sys, weather } = data; // taking required data from received datas
      
      //getting icon based on the icon code from API return
      const icon = `https://openweathermap.org/img/wn/${
        weather[0]["icon"]
        }@2x.png`;

      var wtemp = Math.round(main.temp); // rounding up the temprature

      //changing background color and png image based on temprature 
      if (wtemp > 30 || wtemp == 30) {
        document.body.style.background = "url('./image/burningHot.png')no-repeat right top";
        document.body.style.backgroundColor = "#73000d";
      } else if (wtemp < 30 && wtemp > 20) {
        document.body.style.background = "url('./image/sunnyDay.png')no-repeat right top";
        document.body.style.backgroundColor = "#8f3801";
      } else if (wtemp > 10 && wtemp < 21) {
        document.body.style.background = "url('./image/cloud.png')no-repeat right top";
        document.body.style.backgroundColor = "#2b4d02";
      } else if (wtemp < 10 || wtemp == 10) {
        document.body.style.background = "url('./image/snowman.png')no-repeat right top";
        document.body.style.backgroundColor = "#023d45";
      }
      const li = document.createElement("li");
      li.classList.add("city");

      // markup (appending the 'data-name' attribute with city name and country code to prevent duplicate search. 
      // adding city name and country code because different countrys might have commen city name.)
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${wtemp}<sup>&#8451;</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
        }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => { //will catch if the request is not successfull. 
      if (navigator.onLine) { // checking internet connection
        msg.textContent = "Please try again with a real place..!"; // this message will print if have internetcinnection
      } else { // this alert will show up if the user is offline 
        alert('You are offline !!. Internet Connection is required to continue.');
      }

    });
  msg.textContent = ""; // emptying the text field value (user input)
  form.reset();//reseting form
  input.focus(); //focusing in the input field (for user input)
});
