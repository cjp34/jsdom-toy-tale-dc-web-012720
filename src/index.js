let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    .then(toys => toys.forEach(toy => createNewToy(toy)))
  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyForm.style.display = "block";
      let formSubmit = document.querySelector('.add-toy-form')
      formSubmit.addEventListener("submit", processToyForm)
    } else {
      toyForm.style.display = "none";
    }
  });
});

function createNewToy(toyObject) {
  let toyList = document.getElementById('toy-collection')
  let toyName = toyObject.name
  let toyImage = toyObject.image
  let toyCard = document.createElement('div')
    toyCard.classList.add('card')
    let toyHeader = document.createElement('h2')
      toyHeader.innerText = toyName
    let toyPicture = document.createElement('img')
      toyPicture.classList.add('toy-avatar')
      toyPicture.src = toyImage
    let toyLikes = document.createElement('p')
      toyLikes.id = 'likes'
      toyLikes.innerText = toyObject.likes
    let likeButton = document.createElement('button')
      likeButton.classList.add('like-btn')
      likeButton.innerText = 'Like'
      likeButton.addEventListener("click", (event) => {
        event.preventDefault()
        let currentLikes = parseInt(event.target.parentElement.getElementsByTagName('p').likes.innerText)
        currentLikes += 1
        fetch(`http://localhost:3000/toys/${toyObject.id}`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            "likes": currentLikes
          })
        })
        event.target.parentElement.getElementsByTagName('p').likes.innerText = currentLikes.toString()
      })
    let deleteButton = document.createElement('button')
      deleteButton.classList.add('delete-btn')
      deleteButton.innerText = 'Delete'
      deleteButton.addEventListener("click", (event) => {
        event.preventDefault()
        fetch(`http://localhost:3000/toys/${toyObject.id}`, {
          method: 'DELETE'
        })
        toyCard.remove()
      })
  toyCard.append(toyHeader, toyPicture, toyLikes, likeButton, deleteButton)
  toyList.appendChild(toyCard)
} 

function processToyForm(event) {
  event.preventDefault()
  let toyName = event.target.name.value
  let toyUrl = event.target.image.value
  let toyLikes = 0
  let toyObject = {'name': toyName, 'image': toyUrl, 'likes': toyLikes}
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(toyObject)
  })
   createNewToy(toyObject)
  event.target.reset()
}