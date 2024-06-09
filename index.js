const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
chooseImgBtn = document.querySelector(".choose-img"),
resetBtn = document.querySelector(".reset-filter"),
saveImg = document.querySelector(".save-img"),
previewImg = document.querySelector(".preview-img img")

let brightness = 100,
saturation = 100,
inversion = 0,
grayscale = 0

let rotate = 0, flipHorizontal = 1, flipVertical = 1;

// this is to load the img and Show on the Screen to User
// We are also disabling the Controls if the User have not selected the image
const loadingImg = () => {
    let file = fileInput.files[0]  // getting user selected files
    if(!file) return  // returning if the user have not selected any file 
    previewImg.src = URL.createObjectURL(file)   // Pasing file url as the preview img src
    previewImg.addEventListener("load", () => {
        resetBtn.click();
        document.querySelector(".container").classList.remove("disable")
    })
}

// All filters appling to the images
const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
}

// activating the button that is clicked and showing on range area with the specifed value in variable
filterOptions.forEach(option => {
    option.addEventListener("click", () => {  // adding clicking event listener to all filter button
        document.querySelector(".filter .active").classList.remove("active")
        option.classList.add("active")
        filterName.innerText = option.innerText

        if(option.id === "brightness"){
            filterSlider.max = "200"
            filterSlider.value = brightness
            filterValue.innerText = `${brightness}%`
        } else if(option.id === "saturation") {
            filterSlider.max = "200"
            filterSlider.value = saturation
            filterValue.innerText = `${saturation}%`
        }else if(option.id === "inversion") {
            filterSlider.max = "100"
            filterSlider.value = inversion
            filterValue.innerText = `${inversion}%`
        } else if(option.id === "greyscale") {
            filterSlider.max = "100"
            filterSlider.value = grayscale
            filterValue.innerText = `${grayscale}%`
        } 
    })
})

// updating the filter range and value input
const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`
    const selectedFilter = document.querySelector(".filter .active")  // Getting selected Filter Btn

    if(selectedFilter.id === "brightness"){
        brightness = filterSlider.value
    } else if(selectedFilter.id === "saturation") {
        saturation =  filterSlider.value
    } else if(selectedFilter.id === "inversion") {
        inversion =  filterSlider.value
    } else if(selectedFilter.id === "greyscale") {
        grayscale =  filterSlider.value
    }
    applyFilter()
}

rotateOptions.forEach(option => {
    option.addEventListener("click", () => { // adding clicking event listener to all rotate/flip button
        if(option.id === "left"){
            rotate -= 90   // If clicked Btn is left rotate, decrement rotate value by -90
        } else if(option.id === "right") {
            rotate += 90   // If clicked Btn is right rotate, increment rotate value by +90
        } else if(option.id === "horizontal") {
            // if flipHorizontal value is 1, set this value to -1 else set 1
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else if(option.id === "vertical") {
            // if flipVertical value is 1, set this value to -1 else set 1
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter()
    })
})

const resetFilter = () => {
    // resetting all variable value to its default value
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click()  // Clicking the brightness btn, so the brightness selected by default
    applyFilter()
}

const saveImage = () => {
    const canvas = document.createElement("canvas");  // creating canvas element
    const ctx = canvas.getContext("2d");  // canvas.getContext return a drawing context on canvas
    canvas.width = previewImg.naturalWidth;  // setting canvas width to actual image width
    canvas.height = previewImg.naturalHeight;  // setting canvas height to actual image height
    
    // Applying user selected filters to canvas filter
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);  // translating canvas from center
    if(rotate !== 0) {  // if rotate value isn't 0, rotate the canvas
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);   // flip canvas horizontally / vertically
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a");   // creating <a></a> element
    link.download = "image.png";  // Passing <a></a> tag download value to "image.jpg"
    link.href = canvas.toDataURL();  // Passing <a></a> tag herf value to canvas data url
    link.click();  // clciking <a></a> tag so the image download
}

resetBtn.addEventListener("click", resetFilter)
saveImg.addEventListener("click", saveImage)

fileInput.addEventListener("change", loadingImg)
filterSlider.addEventListener("input", updateFilter)

// To select the user Photo and add to the user gellery 
chooseImgBtn.addEventListener("click", () => fileInput.click())