function form_application(id){
    window.location.href = `form.html?id=${id}`;
}
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
function updateSchedule(param) {
    const day = param.slice(0, -1);
    const index = parseInt(param.slice(-1));

    fetch('http://localhost:3000/update-schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            day: day,
            index: index,
            newValue: "Taken"
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Schedule updated successfully:", data.data);
        } else {
            console.error("Failed to update schedule:", data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from submitting and refreshing the page
    
    // Get values from the form inputs
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Get the 'id' parameter from the URL
    const idParam = getQueryParam('id');

    // Output the data (you can handle the data as needed here)
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('ID from URL:', idParam);
    fetch('data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                updateSchedule(idParam);
                // console.log(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
});