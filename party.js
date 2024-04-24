const COHORT = '/2402-FTB-ET-WEB-PT'
const API = `https://fsa-crud-2aa9294fe819.herokuapp.com/api${COHORT}`
//They want to be able to see a list of all the parties, add new parties, and delete parties.

/*
A user enters the website and finds a list of the names, dates, times, locations, and descriptions of all the parties that are happening.
Next to each party in the list is a delete button. The user clicks the delete button for one of the parties. 
That party is then removed from the list.
There is also a form that allows the user to enter information about a new party that they want to schedule. 
After filling out the form and submitting it, the user observes their party added to the list of parties.
*/

const eventDisplay = document.getElementById('eventDisplay')
const addNewEvent = document.querySelector('form')
const state = {
    events: [],
}
const eventDeleteTracker = []

 //Event details from user input
const eventNameInput = document.getElementById("name")
const eventDescriptionInput = document.getElementById("description")
const eventDateInput = document.getElementById("date")
const eventTimeInput = document.getElementById("time")
const eventLocationInput = document.getElementById("location")
 //submits new event
addNewEvent.addEventListener('submit', addEvent)

async function render() {
    await getEvents()
    renderEvents()
}
render();
async function getEvents(){
    try {
        const response = await fetch(API+"/events")
        const data = await response.json()
        state.events = data.data
    } catch (error) {
        console.log(error)
    }
} 
async function renderEvents(){
    for (let i = 0; i < state.events.length; i++) {
        const currentEvent = state.events[i];
        const myDiv = document.createElement("div");
        const date = currentEvent.date.slice(0,10)
        const time = currentEvent.date.slice(11,16)
        eventDeleteTracker.push(currentEvent.id)
        myDiv.innerHTML = `
            <p>${currentEvent.name}</p>
            <p>id ${currentEvent.id}</p>
            <p>${currentEvent.description}</p>
            <p>date:${date} time:${time}</p>
            <button id="${i}">Delete this event</button>
            `;
        eventDisplay.appendChild(myDiv);
        const deleteButton = document.getElementById(i)
        deleteButton.addEventListener("click", () => deleteEvent(currentEvent.id))
    }

}


async function addEvent(event) {
 //Stops form from refreshing the page
    event.preventDefault();
    const newEventName = eventNameInput.value
    const newEventDesctiption = eventDescriptionInput.value
    const newEventDate = `${eventDateInput.value}T${eventTimeInput.value}:10.000Z`
    const newEventLocation = eventLocationInput.value
    try {
        const response = await fetch(API+'/events', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newEventName,
                description: newEventDesctiption,
                date: newEventDate,
                location: newEventLocation
            })
        })
        if (!response.ok){
            throw new Error("Failed to create event")
        }
        eventDateInput.value = ''
        eventNameInput.value = ''
        eventDescriptionInput.value = ''
        eventTimeInput.value = ''
        eventLocationInput.value = ''
        render()
    } catch (error) {
        console.log(error)
    }
}

async function deleteEvent(buttonId){
    try{
        const response = await fetch(`${API}/events/${buttonId}`,{
            method: "DELETE"
        })
        state.events = data.data
        if(!response.ok){
            throw new Error("failed to delete event")
        }
        render()
    } catch(error) {
        console.log(error)
    }
}
addNewEvent.addEventListener("submit",addEvent)

