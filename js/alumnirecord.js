$(document).ready(function () {
    let offset = 0;
    let tempOffsetRecord = 0;
    let countNextRecord = 0;
    $('#alumniLi').on('click', function () {
        offset = 0
        getAlumniRecord()
    })

    // retrieve alumni record
    function getAlumniRecord() {
        let actionAlumni = {
            action: "readAll",
        };

        let alumniData = new FormData();
        alumniData.append("action", JSON.stringify(actionAlumni));
        alumniData.append('offset', offset)
        let alumniTB = $("#alumniTB");
        let prompt = $("#alumniNoRecMsg");
        $.ajax({
            url: "../PHP_process/alumniData.php",
            method: "POST",
            data: alumniData,
            processData: false,
            contentType: false,
            success: (response) => {
                $("#alumniTB").empty()
                const parsedResponse = JSON.parse(response);
                if (parsedResponse.result == "Unsuccess")
                    //no available data
                    prompt.removeClass("hidden");
                else {
                    prompt.addClass("hidden");
                    //display the data
                    let dataLength = parsedResponse.studentNo.length;
                    for (let i = 0; i < dataLength; i++) {
                        //retrieve data from json
                        let studNo = parsedResponse.studentNo[i];
                        let fullname = parsedResponse.fullname[i];
                        let colCode = parsedResponse.colCode[i];
                        let batchYr = parsedResponse.batchYr[i];
                        let employmentStatus = parsedResponse.employmentStat[i];

                        //creation of table data
                        let tr = $("<tr>");
                        let tdStudentNo = $("<td>").text(studNo);
                        let tdfullname = $("<td>").text(fullname);
                        let tdcolCode = $("<td>").text(colCode);
                        let tdbatchYr = $("<td>").text(batchYr);
                        let tdemploymentStatus = $("<td>").text(employmentStatus);

                        tr.append(
                            tdStudentNo,
                            tdfullname,
                            tdcolCode,
                            tdbatchYr,
                            tdemploymentStatus
                        );
                        alumniTB.append(tr); //display to the table
                    }
                    offset += dataLength
                    tempOffsetRecord = length

                    if (dataLength < 10) $('.nextBtnAlumRecord').addClass('hidden') //hide the next button is if no more to be retrieve
                    if (offset === 0) $('.prevBtnAlumRecord').addClass('hidden') //hide when there's no to be previous
                }
            }
        });
    }


    $('.nextBtnAlumRecord').on('click', function () {
        countNextRecord += tempOffsetRecord
        getAlumniRecord();
        $('.prevBtnAlumRecord').removeClass('hidden')

    })
    $('.prevBtnAlumRecord').on('click', function () {
        countNextRecord -= countNextRecord
        offset = countNextRecord
        if (countNextRecord >= 0) {
            countNextRecord -= tempOffsetRecord
            $('.nextBtnAlumRecord').removeClass('hidden')
            getAlumniRecord();
        }
    })
})