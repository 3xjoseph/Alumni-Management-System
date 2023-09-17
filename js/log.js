
$(document).ready(function () {

    const imgFormat = 'data:image/jpeg;base64,'
    let offset = 0;
    const activityContainer = $('#recentActWrapper')
    const logListContainer = $('#logList')
    displayActivities(offset, true, activityContainer)


    function displayActivities(offset, isDashDisplay, container) {
        const action = "RetrieveData";
        const formData = new FormData();
        formData.append('action', action)
        formData.append('offset', offset)


        $.ajax({
            url: '../PHP_process/log.php',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: response => {
                if (response.response == 'Success') {
                    let length = response.action.length
                    $('.lds-roller').addClass('hidden')
                    if (isDashDisplay) length = 3 //display only 3 activities for dashboard
                    for (let i = 0; i < length; i++) {
                        const action = response.action[i];
                        const timestamp = response.timestamp[i];
                        const details = response.details[i];
                        const colCode = response.colCode[i];
                        const colLogo = imgFormat + response.colLogo[i]; //formatted image

                        const formattedDate = convertTimestamp(timestamp) //format the date
                        createActivities(action, formattedDate, details, colCode, colLogo, container)
                    }
                }
            },
            error: error => { console.log(error) }
        })
    }

    function createActivities(action, timestamp, details, colCode, colLogo, container) {

        const actionWrapper = $('<div>')
            .addClass('flex justify-stretch actionWrapper')

        const imgCollegeLogo = $('<img>')
            .addClass('circle rounded-full bg-gray-400  h-10 w-10')
            .attr('src', colLogo)

        const content = $('<div>')
            .addClass('text-sm ms-2 font-extralight')

        const detailsWrapper = $('<div>')
            .addClass('flex gap-2 items-center')
        const college = $('<span>')
            .addClass('text-gray-700 font-bold text-lg')
            .text(colCode)
        const detailsMsg = $('<p>')
            .addClass('text-gray-500')
            .text(details)
        detailsWrapper.append(college, detailsMsg)

        const time = $('<span>')
            .addClass('text-grayish text-xs')
            .text(timestamp)

        content.append(detailsWrapper, time)
        actionWrapper.append(imgCollegeLogo, content);
        container.append(actionWrapper)

    }

    function convertTimestamp(timestampStr) {
        const timestamp = new Date(timestampStr);

        // Define the date format options
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };

        // Format the date as a string
        const formattedDate = timestamp.toLocaleString(undefined, options);

        return formattedDate;

    }

    const defaultStart = thismonth + "/" + thisday + "/" + thisyear;
    const defaultEnd = thismonth + 1 + "/" + thisday + "/" + thisyear;

    $('#btnViewMoreLog').on('click', function () {
        $('#logHistoryModal').removeClass('hidden')
        $('#logList').find('.actionWrapper').remove() //remove the previously retrieve logs (not duplicate)
        // display the history log today
        displayActivities(offset, false, logListContainer)

    })

    $(function () {
        $('input[name="logdaterange"]').daterangepicker(
            {
                opens: "left",
                startDate: defaultStart,
                endDate: defaultEnd,
            },
            function (start, end, label) {
                console.log(
                    "A new date selection was made: " +
                    start.format("YYYY-MM-DD") +
                    " to " +
                    end.format("YYYY-MM-DD")
                );
            }
        );
    });
});