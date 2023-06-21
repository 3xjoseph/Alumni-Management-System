let inputVal = []
let file;
let username, pass = ""
$(document).ready(function () {
    $("#btnCancelToCollege").click(function () {
        window.location.href = "../admin/admin.php"
    })

    //get logo that have been chosen
    $('#collegeLogo').change(function () {
        changeLogo('#imgAddLogo')
    })

    $('#imgAddLogo').click(function () {
        changeLogo('#imgAddLogo')
        $('.lblLogo').click()
    })

    //add the chosen logo
    function changeLogo(id) {
        const fileInput = $('#collegeLogo')
        file = fileInput[0].files[0]
        const validExtension = ['jpg', 'jpeg', 'png']
        const fileExtension = file.name.split('.').pop().toLowerCase()

        //check if the file extension is valid
        if (validExtension.includes(fileExtension)) {
            //read the file name then get the url of it
            const read = new FileReader()

            read.onload = function (e) {
                $('#errorExtMsg').hide() // hide the error message for the extension
                $('#imgAddLogo').removeClass('hidden')
                $('.lblLogo').addClass('hidden')
                $(id).attr('src', e.target.result)
            }

            read.readAsDataURL(file)
        }
        else {
            $('#errorExtMsg').show()
        }

    }

    $('#btnBrowse').click(function () {
        $('.lblLogo').click()
    })

    // back to filling up the college form
    $('#btnBackFill').on('click', () => {
        $('#fillUpCol').show()
        $('#reviewCol').hide()

        //for going back it will restart the values of the input fields
        const fields = document.querySelectorAll('.answer')
        fields.forEach((element) => {
            element.innerHTML = ""
        })
        inputVal.length = 0 //restart the array of values
    })


    $('#btntoReview').on('click', () => {
        var allFieldsCompleted = true;
        //check if the field are completed
        $('input').each(function () {
            if (!$(this).val()) {
                $(this).removeClass('border-grayish').addClass('border-accent')
                allFieldsCompleted = false;
            }
            else {
                $(this).addClass('border-grayish').removeClass('border-accent')
                inputVal.push($(this).val()) //add every field's value to the array
            }
        });

        if (allFieldsCompleted) {
            //allows to proceed to the next level
            $('#fillUpCol').hide()
            $('#reviewCol').show()
            reviewDetails(inputVal)
        }
    })


    function reviewDetails(value) {
        let index = 1; //start the index the index 0 indicates the image value
        const fields = document.querySelectorAll('.answer')

        //every fields will assign value base on the gathered value of every input field
        fields.forEach((element) => {

            //make the first and last name to be concatenated to make full name
            if (index == 6) {
                element.innerHTML = value[index] + ' ' + value[index + 1]

                //make a autogenerated like username and password
                username = document.getElementById('usernameVal').innerHTML = value[index] + value[index + 1] + 'BulSU-' + value[2]
                pass = document.getElementById('passwordVal').innerHTML = value[index] + value[index + 1] + 'BulSU-' + value[2]
                index += 2 //skip the index 7 (last name)
            }
            else {
                if (index == 13) element.innerHTML = $('input[name="gender"]:checked').val() // add index 13 (gender) value depends which one checked
                else element.innerHTML = value[index] //normal traversing of every element then add a value on it
                index++
            }

        })

        //add logo
        changeLogo("#chosenLogo")
        $('#chosenLogo').removeClass('hidden')
    }


    $('#goBack').on('click', () => window.location.href = "../admin/admin.php")

    $('#collegeForm').submit(function (e) {

        // Push the username and pass variables into the inputVal array
        inputVal.push(username);
        inputVal.push(pass);

        // // Convert the inputVal array to JSON
        var arrayData = JSON.stringify(inputVal);

        e.preventDefault();
        var formData = new FormData(this);

        formData.append('arrayData', arrayData);
        var data = {
            action: 'create',
        };
        formData.append('data', JSON.stringify(data));

        $.ajax({
            url: '../PHP_process/collegeDB.php',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $('#promptMessage').removeClass('hidden');
                $('#insertionMsg').html(response);
            },
            error: function (error) {
                console.log(error)
            }
        })
    })

})


