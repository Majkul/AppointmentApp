    document.addEventListener('DOMContentLoaded', function () {
    // Fetch the JSON file
    fetch('../../data.json')
        .then(response => response.json())  // Parse the JSON data
        .then(data => {
            let tableHead = document.querySelector("#schedule-table thead");
            let tableBody = document.querySelector("#schedule-table tbody");

            // Create table headers (first empty cell for time slots, then days)
            let headerRow = document.createElement("tr");
            
            // First cell in the header is empty
            let emptyHeader = document.createElement("th");
            emptyHeader.textContent = "";
            headerRow.appendChild(emptyHeader);

            // Create headers for each day (from the "columns" array)
            data.columns.forEach(columnObj => {
                let dayHeader = document.createElement("th");
                let day = Object.keys(columnObj)[0];  // Get the day name (e.g., "Monday")
                dayHeader.textContent = day;
                headerRow.appendChild(dayHeader);
            });
            tableHead.appendChild(headerRow);

            // Create the time slots and their corresponding values for each day
            data.rows.forEach((timeSlot, index) => {
                let rowElement = document.createElement("tr");

                // First cell is the time slot (e.g., "10-11", "11-12")
                let timeCell = document.createElement("td");
                timeCell.textContent = timeSlot;
                rowElement.appendChild(timeCell);

                // Create cells for each day corresponding to the time slot
                data.columns.forEach(columnObj => {
                    let dayName = Object.keys(columnObj)[0];  // Get the day name
                    let daySchedule = columnObj[dayName];  // Get the schedule array for that day
                    let scheduleCell = document.createElement("td");
                    if (daySchedule[index] == "Taken"){
                        scheduleCell.id = "taken-cell";
                        scheduleCell.textContent = "Taken"
                    }
                    else{
                        console.log(dayName + " " + index);
                        scheduleCell.innerHTML = `<button onclick="form_application('${dayName + index}')">${daySchedule[index]}</button>`;
                        scheduleCell.id = "free-cell";
                    }
                    rowElement.appendChild(scheduleCell);
                });

                // Append the row to the table body
                tableBody.appendChild(rowElement);
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));
});
